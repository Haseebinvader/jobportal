import React from 'react'
import { Button } from './ui/button'
import { Bookmark } from 'lucide-react'
import { Avatar, AvatarImage } from './ui/avatar'
import { Badge } from './ui/badge'
import { useNavigate } from 'react-router-dom'

const Job = ({ job }) => {
    const navigate = useNavigate();
    // const jobId = "lsekdhjgdsnfvsdkjf";

    const daysAgoFunction = (mongodbTime) => {
        const createdAt = new Date(mongodbTime);
        const currentTime = new Date();
        const timeDifference = currentTime - createdAt;
        return Math.floor(timeDifference / (1000 * 24 * 60 * 60));
    }
    console.log(job);


    return (
        <div className="p-6 bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-xl border border-gray-100 hover:shadow-2xl transition-shadow duration-200">
            <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-gray-400 font-medium">
                    {daysAgoFunction(job?.createdAt) === 0 ? "Today" : `${daysAgoFunction(job?.createdAt)} days ago`}
                </p>
            </div>

            <div className="flex items-center gap-4 my-3">
                <Avatar className="border border-gray-200 shadow-sm">
                    <AvatarImage src={job?.company?.logo} />
                </Avatar>
                <div>
                    <h2 className="text-xl font-semibold text-gray-800">
                        {job?.showName === false ? "Anonymous Company" : job?.company?.name}
                    </h2>
                    <p className="text-sm text-gray-500">{job?.location}</p>
                </div>
            </div>

            <div className="mt-4">
                <h3 className="text-lg font-semibold text-gray-700 mb-1">{job?.title}</h3>
                <p className="text-sm text-gray-500 line-clamp-2">
                    {job?.description
                        ?.split(" ")
                        .slice(0, 9)
                        .join(" ")}
                    {job?.description?.split(" ").length > 9 ? "..." : ""}
                </p>
            </div>

            <div className="flex flex-wrap gap-1 mt-4">
                <Badge className="bg-blue-50 text-blue-700 font-medium">{job?.position} Positions</Badge>
                <Badge className="bg-red-50 text-red-600 font-medium">{job?.jobType}</Badge>
                <Badge className="bg-purple-50 text-purple-600 font-medium">{job?.salary}</Badge>
            </div>

            <Button
                onClick={() => navigate(`/description/${job?._id}`)}
                className="mt-5 w-full bg-yellow-600 hover:bg-yellow-500 text-white font-medium rounded-md shadow-md transition-all duration-200"
            >
                View Details
            </Button>
        </div>
    )
}

export default Job