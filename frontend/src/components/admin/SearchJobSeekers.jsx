import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../shared/Navbar';
import Footer from '../shared/Footer';
import axios from 'axios';

const SearchJobSeekers = () => {
    const { companies, searchCompanyByText } = useSelector(store => store.company);
    const { user } = useSelector(store => store.auth);

    const [jobSeekers, setJobSeekers] = useState([]);
    const [allJobSeekers, setAllJobSeekers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`http://localhost:8000/api/v1/user/jobseekers`)
            .then((res) => {
                setAllJobSeekers(res.data.data);
                setJobSeekers(res.data.data);
            }).catch((err) => {
                console.error(err);
            });
    }, []);

    useEffect(() => {
        const filteredJobSeekers = allJobSeekers?.filter(jobseeker =>
            jobseeker?.jobTitle?.toLowerCase().includes(searchQuery?.toLowerCase()) ||
            jobseeker?.fullname?.toLowerCase().includes(searchQuery?.toLowerCase()) ||
            String(jobseeker?.domesticExp).includes(searchQuery) ||
            String(jobseeker?.InternationalExp).includes(searchQuery) ||
            String(jobseeker?.noticePeriod).includes(searchQuery)
        );
        setJobSeekers(filteredJobSeekers);
    }, [searchQuery, allJobSeekers]);

    const clearSearch = () => {
        setSearchQuery('');
        setJobSeekers(allJobSeekers);
    };

    return (
        <>
            <Navbar />
            <div className='px-32 py-10 h-[70vh]'>
                <div className="mb-4 flex gap-2 items-center w-[30%]">
                    <input
                        type="text"
                        placeholder="Search job seekers"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="p-2 border rounded flex-grow"
                    />
                    {/* {searchQuery && ( */}
                        <button onClick={clearSearch} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                            Clear Search
                        </button>
                    {/* )} */}
                </div>
                <Table>
                    <TableCaption>A list of your searched job seekers</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Job Title</TableHead>
                            <TableHead>Full Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Phone Number</TableHead>
                            <TableHead>Dom Exp</TableHead>
                            <TableHead>Int Exp</TableHead>
                            <TableHead>Notice Period</TableHead>
                            <TableHead>Resume</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {jobSeekers.map((jobseeker, index) => (
                            <tr key={index}>
                                <TableCell>{jobseeker.jobTitle || "N/A"}</TableCell>
                                <TableCell>{jobseeker.fullname}</TableCell>
                                <TableCell>{jobseeker.email}</TableCell>
                                <TableCell>{jobseeker.phoneNumber}</TableCell>
                                <TableCell>{jobseeker.domesticExp} Years</TableCell>
                                <TableCell>{jobseeker.InternationalExp} Years</TableCell>
                                <TableCell>{jobseeker.noticePeriod} Months</TableCell>
                                <TableCell>
                                    <Link target='_blank' rel="noopener noreferrer" to={jobseeker.profile.resume} className='text-blue-500 hover:underline'>
                                        {jobseeker.profile.resumeOriginalName}
                                    </Link>
                                </TableCell>
                            </tr>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <Footer />
        </>
    );
};

export default SearchJobSeekers;
