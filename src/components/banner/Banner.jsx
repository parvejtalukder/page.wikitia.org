import Card from "./Card/Card";
import image_edit from "../../assets/edit.jpg"
import image_add from "../../assets/add.jpg"
import image_create from "../../assets/create.jpg"

const Banner = () => {

    const card_data = [
        { 
            id: 1,
            name: "Edit",
            desc: "Click here to Edit an existing Wikitia page",
            img: image_edit,
            link: "choose-plan"
        },
        {
            id: 2,
            name: "Add a photo/video",
            desc: "Click here to Add a Photo on existing Wikitia page",
            img: image_add,
            link: "request-for-adding-a-photo-video"
        },
        {
            id: 3,
            name: "Create",
            desc: "Click here to Create a page on Wikitia",
            img: image_create,
            link: "request-for-creation-of-a-wikitia-page"
        }
    ]

    return (
        <div className="bg-transparent flex gap-2 flex-col justify-center items-center py-12">
            <h2 className="text-[#136630] font-bold text-5xl">Create or Edit Wikitia page</h2>
            <div className="flex justify-around items-center gap-3">
                {
                    card_data.map((crd) => <Card key={crd.id} card={crd} ></Card>)
                }
            </div>
        </div>
    );
};

export default Banner;