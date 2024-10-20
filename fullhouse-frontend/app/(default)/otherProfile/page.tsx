import { Biohazard } from "lucide-react";
import { Button } from "@/components/ui/button"
import Image from "next/image";

export default function OtherProfile() {
    // Replace these constants with data from backend
    const otherPerson = "Rahsun";
    const bio = "lorem ipsum"
    const location = "Cambridge MA"
    const phone = "555-123-4567"
    const email = "rahsunk@mit.edu"

    return(
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div>
                <div className="p-10 bg-white rounded-lg shadow-md">
                    <div className="flex justify-around">
                        <Image
                        src="/kirbyPop.jpg"
                        alt="Profile Picture"
                        width={128}
                        height={128}
                        />
                        <div>
                            <h1 className="text-4xl font-bold mb-2">Hi! I'm {otherPerson}</h1>
                            <p>{bio}</p>
                        </div>
                    </div>
                    <div>
                        <p>I am staying at {location} this summer.</p>
                        <p>Phone: {phone}</p>
                        <p>Email: {email}</p>
                        <Button variant="default">
                            Message
                        </Button>
                    </div>
                </div>
                <div>
                    <h1>Other people in the same area:</h1>
                    {/* Replce using components and a list of people*/}
                    <div className="flex flex-row">
                        <div className="p-10 bg-white rounded-lg shadow-md">
                            <div className="flex justify-around">
                                <Image
                                src="/kirbyPop.jpg"
                                alt="Profile Picture"
                                width={128}
                                height={128}
                                />
                                <h1 className="text-4xl font-bold mb-2">{otherPerson}</h1>
                            </div>
                            <div>
                                <p>Staying at {location} this summer.</p>
                                <Button variant="default">
                                    View Profile
                                </Button>
                            </div>
                        </div>
                        <div className="p-10 bg-white rounded-lg shadow-md">
                            <div className="flex justify-around">
                                <Image
                                src="/kirbyPop.jpg"
                                alt="Profile Picture"
                                width={128}
                                height={128}
                                />
                                <h1 className="text-4xl font-bold mb-2">{otherPerson}</h1>
                            </div>
                            <div>
                                <p>Staying at {location} this summer.</p>
                                <Button variant="default">
                                    View Profile
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
