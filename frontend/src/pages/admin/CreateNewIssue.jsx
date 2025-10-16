// export default function DashBoard() {
//     return <h1>Dashboard Page</h1>;
// }

import React, { useState } from "react";
import Button from "../../components/tailadmin/ui/button/Button";
import TextArea from "../../components/tailadmin/form/input/TextArea";
import { ArrowLeft, Trash2, Upload } from "lucide-react";

export default function CreateNewIssue() {
    const [issueName, setIssueName] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState(null);
    const [whys, setWhys] = useState([]);
    const [hows, setHows] = useState([]);

    const addWhy = () => setWhys([...whys, ""]);
    const addHow = () => setHows([...hows, ""]);

    const updateWhy = (index, value) => {
        const newWhys = [...whys];
        newWhys[index] = value;
        setWhys(newWhys);
    };

    const updateHow = (index, value) => {
        const newHows = [...hows];
        newHows[index] = value;
        setHows(newHows);
    };

    const deleteWhy = (index) => setWhys(whys.filter((_, i) => i !== index));
    const deleteHow = (index) => setHows(hows.filter((_, i) => i !== index));

    // pic upload logic
    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setImage(imageUrl);
        }
    };

    const handleSubmit = () => {
        const newIssue = {
            name: issueName,
            description,
            whys,
            hows,
            image,
        };
        console.log("Created Issue:", newIssue);
        alert("Issue submitted! Check console for details.");
    };

    return (
        <div className="p-6 max-w-3xl mx-auto">
            {/* back */}
            <div className="flex items-center mb-4">
                <button
                    onClick={() => window.history.back()}
                    className="flex items-center text-gray-600 hover:text-gray-900"
                >
                    <ArrowLeft className="w-5 h-5 mr-1" /> Back
                </button>
            </div>

            <h1 className="text-2xl font-bold mb-6">Create New Issue</h1>

            {/* Issue name + pic upload */}
            <div className="flex items-center gap-4 mb-6">
                {/* pic upload zone */}
                <div className="relative w-20 h-20 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden bg-gray-50">
                    {image ? (
                        <img
                            src={image}
                            alt="Issue avatar"
                            className="object-cover w-full h-full rounded-full"
                        />
                    ) : (
                        <label className="cursor-pointer flex flex-col items-center text-gray-500 text-sm">
                            <Upload className="w-6 h-6 mb-1" />
                            <span>Upload</span>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                            />
                        </label>
                    )}
                </div>

                {/* Issue input */}
                <div className="flex-1">
                    <label className="block text-gray-700 mb-2">Issue Name</label>
                    <input
                        type="text"
                        className="w-full border rounded-lg p-2 focus:outline-none focus:ring focus:ring-blue-200"
                        value={issueName}
                        onChange={(e) => setIssueName(e.target.value)}
                        placeholder="Enter issue name..."
                    />
                </div>
            </div>

            {/* Description input */}
            <div className="mb-8">
                <label className="block text-gray-700 mb-2">Description</label>
                <TextArea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe the issue..."
                    rows={4}
                />
            </div>

            {/* WHY zone */}
            <div className="mb-8">
                <div className="flex justify-between items-center mb-3">
                    <h2 className="text-xl font-semibold">Why</h2>
                    <Button onClick={addWhy}>Add Why</Button>
                </div>
                <div className="space-y-3">
                    {whys.map((why, index) => (
                        <div
                            key={index}
                            className="p-4 border rounded-lg flex justify-between items-center"
                        >
                            <input
                                type="text"
                                className="flex-1 border-none outline-none"
                                value={why}
                                onChange={(e) => updateWhy(index, e.target.value)}
                                placeholder={`Why ${index + 1}...`}
                            />
                            <button
                                onClick={() => deleteWhy(index)}
                                className="text-red-500 hover:text-red-700 ml-2"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* HOW zone */}
            <div className="mb-8">
                <div className="flex justify-between items-center mb-3">
                    <h2 className="text-xl font-semibold">How</h2>
                    <Button onClick={addHow}>Add How</Button>
                </div>
                <div className="space-y-3">
                    {hows.map((how, index) => (
                        <div
                            key={index}
                            className="p-4 border rounded-lg flex justify-between items-center"
                        >
                            <input
                                type="text"
                                className="flex-1 border-none outline-none"
                                value={how}
                                onChange={(e) => updateHow(index, e.target.value)}
                                placeholder={`How ${index + 1}...`}
                            />
                            <button
                                onClick={() => deleteHow(index)}
                                className="text-red-500 hover:text-red-700 ml-2"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* submit button */}
            <div className="text-center">
                <Button onClick={handleSubmit}>Submit Issue</Button>
            </div>
        </div>
    );
}
