import { useState, useEffect } from "react";

const useWhatAreSharks = () => {
  const [data,] = useState(null);

  useEffect(() => {
    // Fetch data or perform any side effects here
    const fetchData = async () => {
      // Example API call - replace with actual endpoint
      // const response = await fetch("/api/what-are-sharks");
      // const result = await response.json();
      // setData(result);
    };

    fetchData();
  }, []);

  return data;
};

export default useWhatAreSharks;