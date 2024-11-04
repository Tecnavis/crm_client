import Select from 'react-select';
import { fetchCategory } from './handle_api';
import { useEffect, useState } from 'react';

const customStyles = {
    control: (provided) => ({
        ...provided,
        backgroundColor: "#0f3460",
        color: "white",
        borderRadius: "5px",
        border: "none",
        boxShadow: "none",
        width: "200px",
        height: "40px",
    }),
    option: (provided, state) => ({
        ...provided,
        backgroundColor: state.isSelected ? "#0f3460" : "white",
        color: state.isSelected ? "white" : "#0f3460",
        "&:hover": {
            backgroundColor: "#0f3460",
            color: "white",
        },
    }),
    singleValue: (provided) => ({
        ...provided,
        color: "white",
    }),
};

const FilterSelect = () => {
    const [category, setCategory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const data = await fetchCategory();
                const formattedData = data.map(cat => ({
                    label: cat.name,  
                    value: cat._id,    
                }));
                setCategory(formattedData);
            } catch (error) {
                console.error("Failed to fetch categories:", error);
            } finally {
                setLoading(false);
            }
        };
        loadCategories();
    }, []);

    return (
        <Select
            options={category}
            placeholder="Filter By Category" 
            styles={customStyles}
            isLoading={loading} 
        />
    );
};

export default FilterSelect;
