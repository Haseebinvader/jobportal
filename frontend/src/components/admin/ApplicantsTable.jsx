import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { MoreHorizontal } from 'lucide-react';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import { APPLICATION_API_END_POINT } from '@/utils/constant';
import axios from 'axios';

const shortlistingStatus = ["Selected", "Rejected", "Shortlisted"];

const ApplicantsTable = () => {
    const { applicants } = useSelector(store => store.application);
    const { user } = useSelector(store => store.auth);

    // Track the status of each applicant individually using their ID
    const [applicantStatuses, setApplicantStatuses] = useState({});

    useEffect(() => {
        // Initialize applicant statuses when the component loads
        const initialStatuses = applicants?.applications?.reduce((acc, applicant) => {
            acc[applicant._id] = applicant?.status || 'Pending';
            return acc;
        }, {});

        setApplicantStatuses(initialStatuses || {});
    }, [applicants]);

    console.log(applicants, user);

    const statusHandler = async (status, id) => {
        console.log('called');
        try {
            axios.defaults.withCredentials = true;
            const res = await axios.post(`${APPLICATION_API_END_POINT}/status/${id}/update`, { status });
            console.log(res);
            if (res.data.success) {
                toast.success(`Application is ${status}`);

                // Update the status for the specific applicant in the state
                setApplicantStatuses(prev => ({
                    ...prev,
                    [id]: status
                }));
            }
        } catch (error) {
            toast.error(error.response.data.message);
        }
    };

    return (
        <div>
            <Table>
                <TableCaption>A list of your recent applied user</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>FullName</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Dom Exp</TableHead>
                        <TableHead>UAE Exp</TableHead>
                        <TableHead>Notice Period</TableHead>
                        <TableHead>Resume</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Application Status</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {applicants && applicants?.applications?.map((item) => (
                        <tr key={item._id}>
                            <TableCell>{item?.applicant?.fullname}</TableCell>
                            <TableCell>{item?.applicant?.email}</TableCell>
                            <TableCell>{item?.applicant?.phoneNumber}</TableCell>
                            <TableCell>{item?.applicant?.domesticExp} Years</TableCell>
                            <TableCell>{item?.applicant?.InternationalExp} Years</TableCell>
                            <TableCell>{item?.applicant?.noticePeriod} Months</TableCell>
                            <TableCell>
                                {item.applicant?.profile?.resume ? (
                                    <a className="text-blue-600 cursor-pointer" href={item?.applicant?.profile?.resume} target="_blank" rel="noopener noreferrer">
                                        {item?.applicant?.profile?.resumeOriginalName}
                                    </a>
                                ) : (
                                    <span>NA</span>
                                )}
                            </TableCell>
                            <TableCell>{item?.applicant.createdAt.split("T")[0]}</TableCell>
                            <TableCell>
                                {applicantStatuses[item._id] || "Pending"}
                            </TableCell>
                            <TableCell className="float-right cursor-pointer">
                                <Popover>
                                    <PopoverTrigger>
                                        <MoreHorizontal />
                                    </PopoverTrigger>
                                    <PopoverContent className="w-32">
                                        {shortlistingStatus.map((status, index) => (
                                            <div onClick={() => statusHandler(status, item?._id)} key={index} className="flex w-fit items-center my-2 cursor-pointer">
                                                <span>{status}</span>
                                            </div>
                                        ))}
                                    </PopoverContent>
                                </Popover>
                            </TableCell>
                        </tr>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default ApplicantsTable;
