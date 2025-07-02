import React from "react";

import { FakeCurriclumnData } from "@/app/api/fakedata/FakeCurriclumnData";

export default function page({ params }: { params: { id: string } }) {
  const curriculum = FakeCurriclumnData.find((item) => item.SubjectID === params.id);
  return (
    <div>
      <h1>{curriculum?.SubjectName}</h1>
      <h1>{curriculum?.SubjectName_EN}</h1>
      <h1>{curriculum?.TotalCredits}</h1>
      <h1>{curriculum?.LectureCredits}</h1>
      <h1>{curriculum?.PracticeCredits}</h1>
      <h1>{curriculum?.SelfStudyCredits}</h1>
    </div>
  );
}
