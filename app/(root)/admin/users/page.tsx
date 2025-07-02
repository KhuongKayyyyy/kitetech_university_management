import { PreviewInformation } from "@/components/ui/PreviewInformation";
import { CALENDAR_IMAGE, INVOICE_IMAGE, STUDENT_IMAGE, UNIVERSITY_IMAGE } from "@/constants/AppImage";

export default function Page() {
  return (
    <>
      <div className="flex flex-col md:flex-row flex-1 gap-4 p-4 pt-0">
        {/* Grid of 4 cards */}
        <div className="grid w-full md:w-1/2 grid-cols-1 md:grid-cols-2 gap-4">
          <PreviewInformation number={6000} type="Total Student" percentage="6.2" imagePath={STUDENT_IMAGE} />
          <PreviewInformation number={300} type="Total Teacher" percentage="4.3" imagePath={UNIVERSITY_IMAGE} />
          <PreviewInformation number={1200} type="Events" percentage="2.1" imagePath={CALENDAR_IMAGE} />
          <PreviewInformation number={200} type="Invoice Status" percentage="1.5" imagePath={INVOICE_IMAGE} />
        </div>

        {/* Big card */}
        {/* <PreviewInformation number={0} type={""} percentage={""} imagePath={""}></PreviewInformation>
         */}
        <div className="w-full md:w-1/2 min-h-[200px] md:min-h-[20vh] rounded-xl bg-muted/50" />
      </div>
      <div className="h-[80vh] w-full rounded-xl bg-muted/50" />
    </>
  );
}
