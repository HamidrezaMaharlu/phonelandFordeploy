import React, {useEffect, useState} from 'react';
import {deleteSearchState} from "../../../store/serachSlice";
import {getAllProducts, GetCategories, GetOrders} from "../../../api";
import {addCategory} from "../../../store/categorySlice";
import {useDispatch, useSelector} from "react-redux";
import {addProducts, sortProducts} from "../../../store/productsSlice";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend, ArcElement,
} from 'chart.js';
import {Bar, Pie} from "react-chartjs-2";
import classes from "./Chart.module.scss";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
);
function Charts(props) {
    const categories = useSelector(state => state.categorySlice)
    const products = useSelector(state => state.productsSlice)
    const [salesData, setSalesData] = useState(null)
    const [salesDataPrice, setSalesDataPrice] = useState(null)
    const [allBrandsQuantity, setAllBrandsQuantity] = useState(null)
    const [allProductsQuantity, setAllProductsQuantity] = useState(null)
    const dispatch = useDispatch()

    const generateHexColors = n => {
        const colors = [];

        for (let i = 0; i < n; i++) {
            const color = '#' + Math.floor(Math.random() * 16777215).toString(16);
            colors.push(color);
        }

        return colors;
    };

    useEffect(() => {
        dispatch(deleteSearchState())
    }, [])
    useEffect(() => {
        document.title = 'فونلند | آمار روزانه';
    }, []);
    useEffect(() => {
        async function getData() {
            const res = await GetCategories()
            dispatch(addCategory(res.data))
        }

        if (categories.length === 0) {
            getData()
        }
    }, [categories]);
    useEffect(() => {
        async function getData() {
            try {
                const res = await getAllProducts()
                dispatch(addProducts(res.data))
                dispatch(sortProducts(res.data))
            } catch (e) {
                console.log(e.message)
            }

        }

        if (products?.allProducts.length === 0) {
            getData()
        }
    }, [products]);


    useEffect(() => {
        // Fetch sales data from API
        GetOrders()
            .then(res => {
                // Group sales data by day
                const dailySales = res.data.reduce((accumulator, sale) => {
                    const saleDate = new Date(sale.createdAt);
                    const saleDay = saleDate.toDateString();
                    accumulator[saleDay] = (accumulator[saleDay] || 0) + 1;
                    return accumulator;
                }, {});

                const dailySalesPrice = res.data.reduce((accumulator, sale) => {
                    const saleDate = new Date(sale.createdAt);
                    const saleDay = saleDate.toDateString();
                    accumulator[saleDay] = (accumulator[saleDay] || 0) + sale.totalPrice;
                    return accumulator;
                }, {});

                // Transform daily sales data into chart data
                const chartData = {
                    labels: Object.keys(dailySales),
                    datasets: [
                        {
                            label: 'Daily Sales',
                            data: Object.values(dailySales),
                            backgroundColor: '#36A2EB',
                            borderColor: '#36A2EB',
                            borderWidth: 1
                        }
                    ]
                };
                const chartDataPrice = {
                    labels: Object.keys(dailySalesPrice),
                    datasets: [
                        {
                            label: 'Daily Sales',
                            data: Object.values(dailySalesPrice),
                            backgroundColor: '#36A2EB',
                            borderColor: '#36A2EB',
                            borderWidth: 1
                        }
                    ]
                };
                setSalesData(chartData);
                setSalesDataPrice(chartDataPrice);
            })
            .catch(err => console.error(err));
    }, []);

    useEffect(() => {
        const brandsQuantity = categories.reduce((accumulator, categories) => {
            const category = categories["name-en"]
            accumulator[category] = products.sortedProducts?.[categories.id]?.length || 0
            return accumulator;
        }, {});
        const productsQuantity = products.allProducts.reduce((accumulator, product) => {
            const productName = product["product-name-en"]
            accumulator[productName] = product.count
            return accumulator;
        }, {});
        const chartProductQuantity = {
            labels: Object.keys(productsQuantity),
            datasets: [
                {
                    label: 'In stock',
                    data: Object.values(productsQuantity),
                    backgroundColor: generateHexColors(categories.length),
                    borderColor: 'gray',
                    borderWidth: 1
                }
            ]
        };
        const chartBrandQuantity = {
            labels: Object.keys(brandsQuantity),
            datasets: [
                {
                    label: 'Number of model',
                    data: Object.values(brandsQuantity),
                    backgroundColor: generateHexColors(categories.length),
                    borderColor: 'gray',
                    borderWidth: 1
                }
            ]
        };
        setAllBrandsQuantity(chartBrandQuantity)
        setAllProductsQuantity(chartProductQuantity)
    }, [categories,products])


    return (
        <div className={classes.container}>
            <div className={classes.sales}>
                {salesData ? (
                    <div>
                        <h2>Daily Sales</h2>
                        <Bar data={salesData}/>
                    </div>
                ) : (
                    <p>Loading sales data...</p>
                )}
            </div>
            <div className={classes.sales}>
                {salesData ? (
                    <div>
                        <h2>Daily Sales</h2>
                        <Bar data={salesDataPrice}/>
                    </div>
                ) : (
                    <p>Loading sales data...</p>
                )}
            </div>
            <div className={classes.pie}>
                {allBrandsQuantity ? (
                    <div style={{width:"100%",height:"100%"}}>
                        <h2>Daily Sales</h2>
                        <Pie options={
                            {
                            responsive: true,
                                plugins: {
                                legend: {
                                    position: 'bottom',
                                }
                            }}} data={allBrandsQuantity}/>
                    </div>
                ) : (
                    <p>Loading sales data...</p>
                )}
            </div>
            <div className={classes.sales}>
                {salesData ? (
                    <div>
                        <h2>Daily Sales</h2>
                        <Bar options={
                            {
                                indexAxis: 'y',
                                responsive: true,
                                plugins: {
                                    legend: {
                                        position: 'bottom',
                                    }
                                }}} data={allProductsQuantity}/>
                    </div>
                ) : (
                    <p>Loading sales data...</p>
                )}
            </div>
        </div>
    );
}

export default Charts;