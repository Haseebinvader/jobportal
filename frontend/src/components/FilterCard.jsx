import React, { useEffect, useState } from 'react';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { useSelector, useDispatch } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import { Button } from './ui/button';
import { FilterX } from 'lucide-react';

const FilterCard = () => {
    const [selectedValue, setSelectedValue] = useState('');
    const [filterData, setFilterData] = useState([]);
    const dispatch = useDispatch();
    const allJobs = useSelector((store) => store.job.allJobs);

    console.log(allJobs);

    const changeHandler = (value) => {
        setSelectedValue(value);
    };

    useEffect(() => {
        dispatch(setSearchedQuery(selectedValue));
    }, [selectedValue, dispatch]);


    const handleClear = () => {
        setSelectedValue("")
        dispatch(setSearchedQuery(""));
    }

    useEffect(() => {
        const locations = new Set();
        const industries = new Set();
        // const salaries = new Set();
        const jobType = new Set();

        allJobs.forEach(job => {
            locations.add(job.location);
            industries.add(job.title);
            // salaries.add(job.salary);
            jobType.add(job.jobType);
        });



        const newFilterData = [
            { filterType: "Location", array: Array.from(locations) },
            { filterType: "Designation", array: Array.from(industries) },
            // { filterType: "Salary", array: Array.from(salaries) },
            { filterType: "Job Type", array: Array.from(jobType) },
        ];

        setFilterData(newFilterData);
    }, [allJobs]);


    return (
        <div className="w-full bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-xl p-5">
            <div className="flex justify-between items-center">
                <h1 className="font-semibold text-xl text-gray-800">Filter Jobs</h1>
                <FilterX
                    className="cursor-pointer text-yellow-500 hover:text-yellow-600 transition-colors duration-200"
                    onClick={handleClear}
                />
            </div>

            <hr className="mt-4 border-gray-200" />

            <RadioGroup value={selectedValue} onValueChange={changeHandler}>
                {filterData.map((data, index) => (
                    <div key={index} className="bg-gray-100 hover:bg-gray-200/70 transition-colors duration-200 rounded-lg p-4 mt-4 shadow-sm">
                        <h2 className="font-semibold text-lg text-gray-700 mb-2">{data.filterType}</h2>
                        {data.array.map((item, idx) => {
                            const itemId = `id${index}-${idx}`;
                            return (
                                <div className="flex items-center space-x-2 my-3" key={itemId}>
                                    <RadioGroupItem
                                        value={item}
                                        id={itemId}
                                        className="text-yellow-500 border-yellow-400"
                                    />
                                    <Label htmlFor={itemId} className="text-gray-600 hover:text-gray-800 cursor-pointer transition-colors">
                                        {item}
                                    </Label>
                                </div>
                            );
                        })}
                    </div>
                ))}
            </RadioGroup>
        </div>
    );
};

export default FilterCard;
