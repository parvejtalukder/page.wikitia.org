import image_kp from "../../assets/kp.jpg";
import Table from "./table/Table";

const Benefits = () => {
  return (
    <>
    <section className="w-full flex flex-col lg:flex-row items-start gap-14 py-12">
      <div className="flex-1 flex justify-center">
        <img src={image_kp} alt="kp" className="w-full max-w-sm lg:max-w-lg rounded-lg object-cover" />
      </div>
      <div className="flex-1 flex flex-col justify-start items-start gap-1">
        <h2 className="text-2xl md:text-3xl font-bold lg:px-0 px-4 text-[#136630] hover:text-[#39ab00] transition">How Wikitia helps you</h2>
        <Table></Table>
      </div>
    </section>
    </>
  );
};

export default Benefits;