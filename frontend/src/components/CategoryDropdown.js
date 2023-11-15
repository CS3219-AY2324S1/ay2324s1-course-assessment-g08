import * as React from 'react';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const categories = [
    "Arrays",
    "Strings",
    "Linked List",
    "Stack",
    "Queue",
    "Tree",
    "Binary Tree",
    "Binary Search Tree",
    "Graph",
    "Depth-First Search (DFS)",
    "Depth-First Seach",
    "Breadth-First Search",
    "Breadth-First Search (BFS)",
    "Union Find",
    "Hash Table",
    "Dynamic Programming",
    "Recursion",
    "Binary Search",
    "Matrix",
    "Two Pointers",
    "Sliding Window",
    "Greedy",
    "Backtracking",
    "Divide and Conquer",
    "Heap",
    "Trie",
    "Sort",
    "Bit Manipulation",
    "Segment Tree",
    "Topological Sort",
    "Geometry",
    "Design",
    "Concurrency",
    "Minimax",
    "Map",
    "Random",
    "Rejection Sampling",
    "Reservoir Sampling",
    "Ordered Map",
    "Monotonic Stack",
    "String Matching",
    "Rolling Hash",
    "Suffix Array",
    "Game Theory",
    "Probability and Statistics",
    "Number Theory",
    "Brainteaser",
    "Line Sweep",
    "Prefix Sum",
    "Bucket Sort",
    "Radix Sort",
    "Counting Sort",
    "Quickselect",
    "Eulerian Circuit",
    "Strongly Connected Component",
    "Biconnected Component",
    "Combinatorics"
];


const CategoryDropdown = ({ selectedCategories, setCategories }) => {
    const handleCategoryChange = (event, newValue) => {
        setCategories(newValue);
    };

    return (
        <Autocomplete
            multiple
            id="checkboxes-tags-demo"
            options={categories}
            disableCloseOnSelect
            getOptionLabel={(option) => option}
            value={selectedCategories}
            renderOption={(props, option, { selected }) => (
                <li {...props}>
                <Checkbox
                    icon={icon}
                    checkedIcon={checkedIcon}
                    style={{ marginRight: 8 }}
                    checked={selected}
                />
                    {option}
                </li>
            )}
            style={{ width: '100%' }}
            onChange={handleCategoryChange}
            renderInput={(params) => (
                <TextField 
                    {...params} 
                    label="Question Categories" 
                    placeholder="Question Categories"
                />
            )}
        />
    );
}

export default CategoryDropdown;