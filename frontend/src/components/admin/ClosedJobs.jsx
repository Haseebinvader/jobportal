import React, { useEffect, useState } from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Avatar, AvatarImage } from '../ui/avatar'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { CirclePause, Edit2, Eye, EyeOff, MoreHorizontal, Users } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setLoading } from '@/redux/authSlice'
import { toast } from 'sonner'
import axios from 'axios'
import { JOB_API_END_POINT } from '@/utils/constant'
import { Input } from '../ui/input'
import Navbar from '../shared/Navbar'
import { Button } from '../ui/button'

const ClosedJobs = () => {
    const { allAdminJobs, searchJobByText } = useSelector(store => store.job);
    const dispatch = useDispatch();
    const [input, setInput] = useState("");
    const [jobs, setJobs] = useState([]);
    const [filteredJobs, setFilteredJobs] = useState([]);
    console.log(allAdminJobs);


    const [filterJobs, setFilterJobs] = useState(allAdminJobs);
    const navigate = useNavigate();


    useEffect(() => {
        const fetchJobs = async () => {
            dispatch(setLoading(true));
            try {
                const response = await axios.get('http://localhost:8000/api/v1/job/getjobsByStatus/Close');
                console.log('API Response:', response.data);  // Add this line to check the structure of the response data
                if (response.data.success) {
                    setJobs(response?.data?.jobs);
                    console.log(response);

                } else {
                    toast.error('Unexpected data format');
                }
            } catch (error) {
                console.error('API error:', error);
                toast.error(error.response?.data.message || 'Failed to update job status');

            } finally {
                dispatch(setLoading(false));
            }
        };
        fetchJobs();

    }, [dispatch])


    console.log(jobs);





    const handleStatusChange = async (jobId, status) => {
        console.log(`Attempting to update job ${jobId} to status ${status}`);
        console.log(jobId);

        try {
            dispatch(setLoading(true));
            const res = await axios.post(`${JOB_API_END_POINT}/updatejob/${jobId}`, {
                jobStatus: status.charAt(0).toUpperCase() + status.slice(1).toLowerCase() // This will capitalize the first letter and make all other letters lowercase
            }, {
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true
            });
            console.log('API response:', res.data);
            if (res.status === 200) {
                toast.success(res.data.message);
                navigate("/admin/jobs")
            } else {
                throw new Error(`Failed to update job status due to non-200 response: ${res.status}`);
            }
        } catch (error) {
            console.error('API error:', error);
            toast.error(error.response?.data.message || 'Failed to update job status');
        } finally {
            dispatch(setLoading(false));
        }
    }

    console.log(filterJobs);


    return (
        <div>
            <Navbar />
            <div className='max-w-6xl mx-auto my-10'>
                <div className=' my-5'>
                    <div className='flex justify-between'>
                        <Input
                            className="w-fit"
                            placeholder="Filter by name, role"
                            onChange={(e) => setInput(e.target.value)}
                        />
                    <Button onClick={() => navigate("/admin/jobs")}>All Jobs</Button>
                    </div>

                    <div>
                        <Table>
                            <TableCaption>A list of your recent Closed jobs</TableCaption>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Company Name</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {
                                    jobs?.map((job) => (<tr>
                                        <TableCell>{job?.company?.name}</TableCell>
                                        <TableCell>{job?.title}</TableCell>
                                        <TableCell>{job?.createdAt.split("T")[0]}</TableCell>
                                        <TableCell className="text-right cursor-pointer">
                                            <Popover>
                                                <PopoverTrigger><MoreHorizontal /></PopoverTrigger>
                                                <PopoverContent className="w-32">
                                                    <div onClick={() => navigate(`/admin/companies/${job._id}`)} className='flex items-center gap-2 w-fit cursor-pointer'>
                                                        <Edit2 className='w-4' />
                                                        <span>Edit</span>
                                                    </div>
                                                    <div onClick={() => navigate(`/admin/jobs/${job._id}/applicants`)} className='flex items-center w-fit gap-2 cursor-pointer mt-2'>
                                                        <Users className='w-4' />
                                                        <span>Applicants</span>
                                                    </div>
                                                    <div onClick={() => handleStatusChange(job._id, 'Open')} className='flex items-center w-fit gap-2 cursor-pointer mt-2'>
                                                        <Eye className='w-4' />
                                                        <span>Open</span>
                                                    </div>
                                                    {/* <div onClick={() => handleStatusChange(job._id, 'Close')} className='flex items-center w-fit gap-2 cursor-pointer mt-2'>
                                                        <EyeOff className='w-4' />
                                                        <span>Close</span>
                                                    </div> */}
                                                    {/* <div onClick={() => handleStatusChange(job._id, 'Pause')} className='flex items-center w-fit gap-2 cursor-pointer mt-2'>
                                                        <CirclePause className='w-4' />
                                                        <span>Pause</span>
                                                    </div> */}
                                                </PopoverContent>
                                            </Popover>
                                        </TableCell>
                                    </tr>

                                    ))
                                }
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ClosedJobs