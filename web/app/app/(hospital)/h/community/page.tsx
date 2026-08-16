// --@ts-nocheck
"use client";

import React, { useEffect, useState } from "react";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/context/UserContext";
import { db } from "@/firebaseConfig";
import { collection, query, getDocs, setDoc, doc, updateDoc, getDoc, runTransaction } from "firebase/firestore";
import { MessageSquare, Users, Award, Calendar, Vote, Plus, Heart, Share2 } from "lucide-react";

export default function CommunityPage() {
  const { toast } = useToast();
  const { userId, role } = useUser();

  const [posts, setPosts] = useState<any[]>([]);
  const [pollVotes, setPollVotes] = useState<any>({ helping: 45, need: 28, health: 15, community: 32 });
  const [hasVoted, setHasVoted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Discussion Form State
  const [postDialogOpen, setPostDialogOpen] = useState(false);
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");

  useEffect(() => {
    if (!db) return;

    const fetchCommunityData = async () => {
      setLoading(true);
      try {
        // 1. Fetch Discussion Posts
        const postsRef = collection(db, "community-posts");
        const postsSnap = await getDocs(postsRef);
        const fetchedPosts = postsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // Sort by creation date descending
        fetchedPosts.sort((a: any, b: any) => {
          const dateA = a.createdAt ? new Date(a.createdAt.seconds * 1000).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt.seconds * 1000).getTime() : 0;
          return dateB - dateA;
        });
        setPosts(fetchedPosts);

        // 2. Fetch Poll Status
        const pollRef = doc(db, "community-polls", "motivation-poll");
        const pollSnap = await getDoc(pollRef);
        if (pollSnap.exists()) {
          setPollVotes(pollSnap.data().votes || { helping: 45, need: 28, health: 15, community: 32 });
        } else {
          // Initialize poll doc if missing
          await setDoc(pollRef, {
            question: "What is your primary motivation to donate blood?",
            votes: { helping: 45, need: 28, health: 15, community: 32 }
          });
        }

        // Check local storage if user voted already
        const voted = localStorage.getItem(`voted_motivation_${userId}`);
        if (voted) {
          setHasVoted(true);
        }
      } catch (err) {
        console.error("Failed to load community details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCommunityData();
  }, [userId]);

  const handleCreatePost = async () => {
    if (!db || !userId) return;

    if (!postTitle || !postContent) {
      toast({
        title: "Required Fields Missing",
        description: "Please enter both a title and message content.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const postId = `post-${Date.now()}`;
      
      // Get author's details from local storage/context
      const authorName = role === "donor" ? "Registered Donor" : role === "hospital" ? "Partner Hospital" : role === "organisation" ? "NGO Partner" : "Sync Patient";

      const newPost = {
        authorId: userId,
        authorName,
        authorRole: role,
        title: postTitle,
        content: postContent,
        createdAt: new Date(),
      };

      await setDoc(doc(db, "community-posts", postId), newPost);

      setPosts(prev => [
        { id: postId, ...newPost },
        ...prev
      ]);

      toast({
        title: "📝 Discussion Post Created",
        description: "Your post is now active on the community board.",
      });

      setPostDialogOpen(false);
      setPostTitle("");
      setPostContent("");
    } catch (err) {
      console.error("Failed to create post:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (option: string) => {
    if (!db || hasVoted) return;

    try {
      const pollRef = doc(db, "community-polls", "motivation-poll");
      
      await runTransaction(db, async (transaction) => {
        const sfDoc = await transaction.get(pollRef);
        if (!sfDoc.exists()) {
          throw "Document does not exist!";
        }

        const currentVotes = sfDoc.data().votes || { helping: 45, need: 28, health: 15, community: 32 };
        const newVotes = {
          ...currentVotes,
          [option]: (currentVotes[option] || 0) + 1
        };

        transaction.update(pollRef, { votes: newVotes });
        setPollVotes(newVotes);
      });

      setHasVoted(true);
      localStorage.setItem(`voted_motivation_${userId}`, "true");
      
      toast({
        title: "🗳️ Vote Registered",
        description: "Thank you for participating in the community poll!",
      });
    } catch (err) {
      console.error("Failed to register vote:", err);
    }
  };

  const totalPollVotes = Object.values(pollVotes).reduce((a: any, b: any) => a + b, 0) as number;

  const getOptionPercentage = (optCount: number) => {
    return Math.round((optCount / (totalPollVotes || 1)) * 100);
  };

  return (
    <ContentLayout title="Community Board">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-2 pb-10">
        
        {/* Left Column: Discussions & Posts Feed */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center border-b border-border/40 pb-3">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-red-500" /> Discussion Board
            </h2>
            <Button size="sm" className="bg-accent text-white gap-1.5" onClick={() => setPostDialogOpen(true)}>
              <Plus className="h-4 w-4" /> Start Discussion
            </Button>
          </div>

          <div className="space-y-4">
            {posts.length === 0 ? (
              <Card className="p-8 text-center border-2 border-dashed">
                <p className="text-muted-foreground text-sm">No discussions started yet. Be the first to post!</p>
              </Card>
            ) : (
              posts.map((post) => (
                <Card key={post.id} className="hover:shadow-md transition rounded-2xl border border-border/40">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="font-bold text-lg text-foreground">{post.title}</h3>
                      <Badge className="bg-red-500/10 text-red-500 border-red-500/20 capitalize text-[10px]">{post.authorRole}</Badge>
                    </div>
                    <CardDescription className="text-xs flex items-center gap-1.5">
                      <span>Posted by <strong>{post.authorName}</strong></span>
                      <span>•</span>
                      <span>{post.createdAt ? new Date(post.createdAt.seconds * 1000).toLocaleDateString() : "Just now"}</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
                      {post.content}
                    </p>
                  </CardContent>
                  <CardFooter className="pt-2 border-t border-border/20 flex gap-4 text-xs text-muted-foreground">
                    <button className="flex items-center gap-1 hover:text-red-500 transition">
                      <Heart className="h-4 w-4" /> Like
                    </button>
                    <button className="flex items-center gap-1 hover:text-blue-500 transition">
                      <Share2 className="h-4 w-4" /> Share
                    </button>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Active Poll & Resources */}
        <div className="space-y-6">
          {/* Active Poll Card */}
          <Card className="shadow-md border border-border/40 bg-card rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Vote className="h-5 w-5 text-red-500" /> Community Poll
              </CardTitle>
              <CardDescription>What is your primary motivation to donate blood?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { label: "🎉 Helping others in need", key: "helping" },
                { label: "❤️ Family or Friend emergency", key: "need" },
                { label: "💪 Personal health benefits", key: "health" },
                { label: "🤝 Local community support", key: "community" }
              ].map(opt => {
                const count = pollVotes[opt.key] || 0;
                const pct = getOptionPercentage(count);

                return (
                  <div key={opt.key} className="space-y-1">
                    <button
                      onClick={() => handleVote(opt.key)}
                      disabled={hasVoted}
                      className={`w-full text-left p-3 rounded-xl border text-sm font-semibold transition flex justify-between items-center ${
                        hasVoted 
                          ? "bg-muted/30 border-border/40 cursor-default" 
                          : "border-border/60 hover:bg-red-500/10 hover:border-red-500"
                      }`}
                    >
                      <span>{opt.label}</span>
                      {hasVoted && <span className="text-xs text-muted-foreground">{pct}% ({count})</span>}
                    </button>
                    {hasVoted && (
                      <div className="w-full bg-muted h-1.5 rounded-full overflow-hidden">
                        <div className="bg-red-500 h-full rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                    )}
                  </div>
                );
              })}
            </CardContent>
            {hasVoted && (
              <CardFooter className="text-xs text-muted-foreground text-center flex justify-center border-t border-border/20 pt-3">
                Total participation: {totalPollVotes} votes
              </CardFooter>
            )}
          </Card>

          {/* Success Stories Sidebar */}
          <Card className="shadow-md border border-border/40 bg-card rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Award className="h-5 w-5 text-red-500" /> Success Stories
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              <div className="border-b border-border/20 pb-3 space-y-1">
                <p className="font-bold text-foreground">"Transfusion Success in Record Time"</p>
                <p className="text-muted-foreground line-clamp-3">
                  Thanks to Donor Sync alerts, city hospital matching routed O- blood within 18 minutes for an emergency bypass surgery.
                </p>
              </div>
              <div className="space-y-1">
                <p className="font-bold text-foreground">"15 Donation Milestones reached"</p>
                <p className="text-muted-foreground line-clamp-3">
                  Local donor Anil K. reached his 15th whole blood donation milestone using the eligibility cooldown reminders.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>

      {/* New Discussion Post Dialog */}
      <Dialog open={postDialogOpen} onOpenChange={setPostDialogOpen}>
        <DialogContent className="max-w-md text-left">
          <DialogHeader>
            <div className="flex items-center justify-between w-full">
              <DialogTitle>Start a New Discussion</DialogTitle>
              <Button onClick={() => setPostDialogOpen(false)} variant="outline" size="sm">
                Cancel
              </Button>
            </div>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label>Title / Topic *</Label>
              <Input
                value={postTitle}
                onChange={(e) => setPostTitle(e.target.value)}
                placeholder="E.g. Preparing for my first blood donation camp"
              />
            </div>

            <div>
              <Label>Message Content *</Label>
              <textarea
                className="w-full h-32 p-2.5 rounded-lg border border-input bg-background text-sm text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                placeholder="Share your thoughts, ask questions, or describe insights..."
              />
            </div>
          </div>

          <DialogFooter>
            <Button onClick={handleCreatePost} disabled={loading} className="w-full bg-accent text-white font-bold">
              {loading ? "Posting..." : "Post to Board"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </ContentLayout>
  );
}