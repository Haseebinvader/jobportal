import React, { useEffect, useState } from 'react'
import Navbar from './shared/Navbar'
import FilterCard from './FilterCard'
import Job from './Job';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Search } from 'lucide-react';
import { setSearchedQuery } from '@/redux/jobSlice';

// const jobsArray = [1, 2, 3, 4, 5, 6, 7, 8];

const Jobs = () => {
    const { allJobs, searchedQuery } = useSelector(store => store.job);
    const [filterJobs, setFilterJobs] = useState(allJobs);
    const [query, setQuery] = useState("");
    const dispatch = useDispatch();

    useEffect(() => {
        if (searchedQuery) {
            const filteredJobs = allJobs.filter((job) => {
                const queryLower = typeof searchedQuery === 'string' ? searchedQuery.toLowerCase() : '';
                let salaryQuery = Number(searchedQuery);
                let matchesSalary = !isNaN(salaryQuery) && job.salary === salaryQuery;

                return job.title.toLowerCase().includes(queryLower) ||
                    job.description.toLowerCase().includes(queryLower) ||
                    job.location.toLowerCase().includes(queryLower) ||
                    matchesSalary ||  // Ensure this condition is correctly evaluating
                    job.jobType.toLowerCase().includes(queryLower);
            });



            setFilterJobs(filteredJobs);
        } else {
            setFilterJobs(allJobs);
        }
    }, [allJobs, searchedQuery]);
    const searchJobHandler = () => {
        dispatch(setSearchedQuery(query));
    }

    console.log(allJobs);


    return (
        <div>
            <Navbar />
            <div className='max-w-7xl mx-auto mt-5 '>
                <div className='flex w-[40%] shadow-lg border border-gray-200 pl-3 rounded-full items-center gap-4 mx-auto my-6 '>
                    <input
                        type="text"
                        placeholder='Find your dream jobs'
                        onChange={(e) => setQuery(e.target.value)}
                        className='outline-none border-none w-full'
                    />
                    <Button onClick={searchJobHandler} className="rounded-r-full bg-yellow-600 text-center">
                        <Search className='h-5 w-5' />
                    </Button>
                </div>
                <div className='flex gap-5 border p-6 rounded-sm'>
                    <div className='w-20%'>
                        <FilterCard />
                    </div>
                    {
                        filterJobs.length <= 0 ? <span>Job not found</span> : (
                            <div className='flex-1 overflow-y-auto pb-5 border p-10 rounded-md'>
                                <div className='grid grid-cols-3 gap-4'>
                                    {
                                        filterJobs.map((job) => (
                                            <motion.div
                                                initial={{ opacity: 0, x: 100 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -100 }}
                                                transition={{ duration: 0.3 }}
                                                key={job?._id}>
                                                <Job job={job} />
                                            </motion.div>
                                        ))
                                    }
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default Jobs