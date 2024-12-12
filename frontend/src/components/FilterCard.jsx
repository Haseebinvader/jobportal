import React, { useEffect, useState } from 'react';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { useSelector, useDispatch } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import { Button } from './ui/button';

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

        allJobs.forEach(job => {
            locations.add(job.location);
            industries.add(job.title); // Assuming 'title' maps to industry/job type
        });



        const newFilterData = [
            { filterType: "Location", array: Array.from(locations) },
            { filterType: "Designation", array: Array.from(industries) },
        ];

        setFilterData(newFilterData);
    }, [allJobs]);

    return (
        <div className='w-full bg-white p-3 rounded-md'>
            <h1 className='font-bold text-lg'>Filter Jobs</h1>
            <Button onCick={handleClear}>Clear Filters</Button>
            <hr className='mt-3' />
            <RadioGroup value={selectedValue} onValueChange={changeHandler}>
                {filterData.map((data, index) => (
                    <div key={index}>
                        <h1 className='font-bold text-lg'>{data.filterType}</h1>
                        {data.array.map((item, idx) => {
                            const itemId = `id${index}-${idx}`;
                            return (
                                <div className='flex items-center space-x-2 my-2' key={itemId}>
                                    <RadioGroupItem value={item} id={itemId} />
                                    <Label htmlFor={itemId}>{item}</Label>
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
