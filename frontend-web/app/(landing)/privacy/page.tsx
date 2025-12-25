// app/terms/page.tsx
import ClientPortal from "@/components/ClientPortal";
import { ScrollArea } from "@/components/ui/scroll-area";
import BusinessNavbar from "@/components/landing-page/BusinessNavbar";
import Footer from "@/components/landing-page/footer";

import { promises as fs } from "fs";
import path from "path";
import { remark } from "remark";
import html from "remark-html";

export const metadata = {
  title: "Privacy Policy | DonorSync",
  description: "Read this to understand about how the DonorSync platform handles your data and privacy.",
};



export default async function PrivacyPage() {
  const filePath = path.join(process.cwd(), "app", "(landing)", "privacy", "privacy.md");
  const fileContents = await fs.readFile(filePath, "utf8");

  const processedContent = await remark().use(html).process(fileContents);
  const contentHtml = processedContent.toString();

  return (
    <ClientPortal>

      <ScrollArea className="h-screen absolute-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5">
        <BusinessNavbar />

        {/* Privacy content */}
        <div className="max-w-2xl mx-auto p-10 pt-20 pb-20 text-foreground scrollbar-hide">
          <br></br><br></br>
          <article className="prose 
    prose-headings:text-foreground 
    prose-p:text-foreground 
    prose-li:text-foreground 
    prose-strong:text-foreground">
            <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
          </article>
        </div>



        <Footer />
      </ScrollArea>

    </ClientPortal>
  );
}


