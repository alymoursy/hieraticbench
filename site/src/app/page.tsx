import { DatasetPreview } from "@/components/home/DatasetPreview";
import { FairTest } from "@/components/home/FairTest";
import { Gap } from "@/components/home/Gap";
import { Goal } from "@/components/home/Goal";
import { Hero } from "@/components/home/Hero";
import { Hieratic } from "@/components/home/Hieratic";
import { Join } from "@/components/home/Join";
import { Ladder } from "@/components/home/Ladder";
import { LeaderboardTable } from "@/components/home/LeaderboardTable";
import { Record } from "@/components/home/Record";

export default function Home() {
  return (
    <>
      <Hero />
      <Record />
      <Gap />
      <Goal />
      <Hieratic />
      <FairTest />
      <Ladder />
      <LeaderboardTable />
      <DatasetPreview />
      <Join />
    </>
  );
}
