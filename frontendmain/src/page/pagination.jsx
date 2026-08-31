import React, { useEffect, useState } from 'react';

const PaginatedList = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(5);  // Define the limit per page here
  const [totalPages, setTotalPages] = useState(1); // Total pages will be set dynamically

  // start the query 
  const [name, setName] = useState('');
  const [country , setCountry]=useState('')
  const [hobby, setHobby] = useState('')
const [remove , setRemove]=useState()
const [eligible , setEligible]=useState()


  let query =http://localhost:9000/v2/DataGet?page=${page}
  &limit=${limit}&names=${name}&countrys=${country}&hoobies=${hobby}&removes=${remove}&truess=${eligible }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(query);
        console.log(response);
        setData(response.data.data);  // Set the fetched data
        setTotalPages(Math.ceil(response.data.totalCount / limit)); // Calculate total pages
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [page, limit, name,country,hobby,remove,eligible ]); // Fetch data when page, limit, or name change

  const nextPage = () => {
    setPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const prevPage = () => {
    setPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleSearch = (e) => {
    e.preventDefault(); // Prevent form submission
    setPage(1); // Reset to first page on search
  };