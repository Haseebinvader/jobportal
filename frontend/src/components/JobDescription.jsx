import React, { useEffect, useState } from 'react'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from '@/utils/constant';
import { setSingleJob } from '@/redux/jobSlice';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import Navbar from './shared/Navbar';
import Footer from './shared/Footer';

const JobDescription = () => {
    const { singleJob } = useSelector(store => store.job);
    const { user } = useSelector(store => store.auth);
    const isIntiallyApplied = singleJob?.applications?.some(application => application?.applicant === user?._id) || false;
    const [isApplied, setIsApplied] = useState(isIntiallyApplied);
    const [isJobOpen, setIsJobOpen] = useState(singleJob?.jobStatus === "Open");

    useEffect(() => {
        setIsJobOpen(singleJob?.jobStatus === "Open"); // Directly check if job is open
    }, [singleJob]);

    const params = useParams();
    const jobId = params.id;
    const dispatch = useDispatch();

    const applyJobHandler = async () => {
        try {
            const res = await axios.get(`${APPLICATION_API_END_POINT}/apply/${jobId}`, { withCredentials: true });

            if (res.data.success) {
                setIsApplied(true); // Update the local state
                const updatedSingleJob = { ...singleJob, applications: [...singleJob.applications, { applicant: user?._id }] }
                dispatch(setSingleJob(updatedSingleJob)); // helps us to real time UI update
                toast.success(res.data.message);

            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    }

    useEffect(() => {
        const fetchSingleJob = async () => {
            try {
                const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, { withCredentials: true });
                if (res.data.success) {
                    dispatch(setSingleJob(res.data.job));
                    setIsApplied(res.data.job.applications.some(application => application.applicant === user?._id)) // Ensure the state is in sync with fetched data
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchSingleJob();
    }, [jobId, dispatch, user?._id]);

    const handleJobApply = () => {
        if (isJobOpen) {
            if (!isApplied) {
                applyJobHandler();
            } else {
                toast.error("You have already applied to this job!")
            }
        } else {
            toast.success("You cannot apply to this job, this job might be expired!");
        }
    }

    return (
        <div className='max-w-7xl mx-auto px-4 py-10'>
            <Navbar />
            <div className='bg-white shadow-lg rounded-lg overflow-hidden'>
                <div className='p-5'>
                    <h1 className='text-2xl font-bold text-gray-800 mb-3'>{singleJob?.title}</h1>
                    <div className='flex flex-wrap items-center gap-2 mb-4'>
                        <Badge className='text-blue-700 font-bold' variant="outline">{singleJob?.position} Positions</Badge>
                        <Badge className='text-red-600 font-bold' variant="outline">{singleJob?.jobType}</Badge>
                        <Badge className='text-purple-700 font-bold' variant="outline">{singleJob?.salary} LPA</Badge>
                    </div>
                    {user && (
                        <Button
                            onClick={handleJobApply}
                            className={`w-full sm:w-auto font-semibold rounded-lg px-6 py-2 transition-colors duration-300 ${isApplied ? 'bg-gray-400 text-white cursor-not-allowed' : 'bg-purple-700 text-white hover:bg-purple-800'}`}
                        >
                            {isApplied ? 'Already Applied' : 'Apply Now'}
                        </Button>
                    )}

                </div>
                <div className='border-t border-gray-200'>
                    <div className='p-5'>
                        <h2 className='text-lg font-medium text-gray-700 mb-2'>Job Description</h2>
                        <p className='text-gray-600'><strong>Role:</strong> {singleJob?.title}</p>
                        <p className='text-gray-600'><strong>Location:</strong> {singleJob?.location}</p>
                        <p className='text-gray-600'><strong>Description:</strong> {singleJob?.description}</p>
                        <p className='text-gray-600'><strong>Experience Required:</strong> {singleJob?.experience} years</p>
                        <p className='text-gray-600'><strong>Salary:</strong> {singleJob?.salary} LPA</p>
                        <p className='text-gray-600'><strong>Total Applicants:</strong> {singleJob?.applications?.length}</p>
                        <p className='text-gray-600'><strong>Posted On:</strong> {singleJob?.createdAt.split("T")[0]}</p>
                    </div>
                </div>
            </div>
            <Footer />
        </div>

    )
}

export default JobDescription