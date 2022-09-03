import React, {FC, useContext, useEffect, useRef, useState} from "react";
import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
import qs from "qs";

import {Categories} from "../components/Categories";
import {Sort, sortList} from "../components/Sort";
import {PizzaBlock} from "../components/PizzaBlock/PizzaBlock";
import {SearchContext} from "../App";
import {Skeleton} from "../components/PizzaBlock/Skeleton";
import {Pagination} from "../components/Pagination/Pagination";
import {AppDispatchType, useAppSelector} from "../redux/store";
import {setCategoryId, setCurrentPage, setFilters} from "../redux/slices/filterSlice";
import {fetchPizzasTC} from "../redux/slices/pizzaSlice";

type HomePropsType = {}

export type SortType = {
   name: string,
   sortProperty: string,
}

export const Home: FC<HomePropsType> = () => {
   const {categoryId, sort, currentPage} = useAppSelector(state => state.filter)
   const {items, status} = useAppSelector(state => state.pizza)
   const {searchValue} = useContext(SearchContext)
   const dispatch = useDispatch<AppDispatchType>()
   const isSearch = useRef(false)
   const isMounted = useRef(false)
   const navigate = useNavigate()

   const array = [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined]

   const getPizzas = () => {
      const sortBy = sort.sortProperty.replace('-', '')
      const order = sort.sortProperty.includes('-') ? 'asc' : 'desc'
      const category = categoryId > 0 ? `category=${categoryId}` : ''
      const search = searchValue ? `search=${searchValue}` : ''

      dispatch(fetchPizzasTC({currentPage, category, sortBy, order, search}))
   }

// Если изменили параметры и был первый рендер
   useEffect(() => {
      if (isMounted.current) {
         const queryString = qs.stringify({
            sortProperty: sort.sortProperty,
            categoryId,
            currentPage
         })

         navigate(`?${queryString}`)
      }
      isMounted.current = true
   }, [categoryId, sort.sortProperty, currentPage])

   //Если был первый рендер, то проверяем URL - параметры и сохраняем в редаксе
   useEffect(() => {
      if (window.location.search) {
         const params = qs.parse(window.location.search.substring(1))

         const sort = sortList.find((obj) => obj.sortProperty === params.sortProperty)

         dispatch(
            setFilters({
               ...params,
               sort,
            })
         )
         isSearch.current = true
      }
   }, [])

   // Если был первый рендер, то запрашиваем пиццы
   useEffect(() => {
      window.scrollTo(0, 0)

      if (!isSearch.current) {
         getPizzas()
      }

      isSearch.current = false
   }, [categoryId, sort.sortProperty, currentPage])


   const onClickCategory = (categoryId: number) => {
      dispatch(setCategoryId(categoryId))
   }

   const onChangePage = (num: number) => {
      dispatch(setCurrentPage(num))
   }

   const skeleton = array.map((_, index) => <Skeleton key={index}/>)
   const pizzas = items.map((obj) => (
      <PizzaBlock key={obj.id} {...obj}/>
   ))

   return (
      <div className='container'>
         <div className="contentTop">
            <Categories categoryID={categoryId} onClickCategory={onClickCategory}/>
            <Sort/>
         </div>
         <h2 className="contentTitle">Все пиццы</h2>
            {status === "error"
               ? <div className="contentErrorInfo">
                  <h2>Произошла ошибка</h2>
                  <p>К сожалению, не удалось получить пиццы. Попробуйте повторить попытку позже</p>
            </div>
               :  <div className="contentItems">{status === 'loading' ? skeleton : pizzas}</div>
            }
         <Pagination currentPage={currentPage} onChangePage={onChangePage}/>
      </div>
   );
};
