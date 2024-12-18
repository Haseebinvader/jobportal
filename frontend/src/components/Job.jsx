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
        <div className='p-5 rounded-md shadow-xl bg-white border'>
            <div className='flex items-center justify-between'>
                <p className='text-sm text-gray-500'>{daysAgoFunction(job?.createdAt) === 0 ? "Today" : `${daysAgoFunction(job?.createdAt)} days ago`}</p>
                {/* <Button variant="outline" className="rounded-full" size="icon"><Bookmark /></Button> */}
            </div>

            <div className='flex items-center gap-2 my-2'>
                <Button className="p-6" variant="outline" size="icon">
                    <Avatar>
                        <AvatarImage src={job?.company?.logo} />
                    </Avatar>
                </Button>
                <div>
                    <h1 className='font-medium text-lg h-[50px] items-center flex'>{job?.showName == false ? "Anonymous Company " : job?.company?.name}</h1>
                    <p className='text-sm text-gray-500'>{job?.location}</p>
                </div>
            </div>

            <div>
                <h1 className='font-bold text-lg my-2'>{job?.title}</h1>
                <p className='text-sm text-gray-600 h-[40px]'>{job?.description}</p>
            </div>
            <div className='flex justify-between mt-4'>
                <Badge className={'text-blue-700 font-bold'} variant="ghost"> No. of positions: {job?.position} Positions</Badge>
            </div>
            <div className='flex justify-between mt-4'>
                <Badge className={'text-[#F83002] font-bold'} variant="ghost">Job Type: {job?.jobType}</Badge>
            </div>
            <div className='flex justify-between  mt-4'>
                <Badge className={'text-[#7209b7] font-bold'} variant="ghost">Annual Salary: {job?.salary}</Badge>
            </div>
            <div className='flex items-center gap-4 mt-4 w-full border'>
                <Button onClick={() => navigate(`/description/${job?._id}`)} variant="outline" className='w-full bg-yellow-600 text-white'>Details</Button>
                {/* <Button className="bg-[#7209b7]">Save For Later</Button> */}
            </div>
        </div>
    )
}

export default Job