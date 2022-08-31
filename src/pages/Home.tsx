import React, {FC, useContext, useEffect, useState} from "react";
import {useDispatch} from "react-redux";

import {Categories} from "../components/Categories";
import {Sort} from "../components/Sort";
import {PizzaBlock} from "../components/PizzaBlock/PizzaBlock";
import {PizzaType, SearchContext} from "../App";
import {Skeleton} from "../components/PizzaBlock/Skeleton";
import {Pagination} from "../components/Pagination/Pagination";

import {AppDispatchType, useAppSelector} from "../redux/store";
import {setCategoryId, setCurrentPage} from "../redux/slices/filterSlice";
import {pizzasAPI} from "../api/pizza-api";


type HomePropsType = {}

export type SortType = {
   name: string,
   sortProperty: string,
}

export const Home: FC<HomePropsType> = () => {
   const {categoryId, sort, currentPage} = useAppSelector(state => state.filter)
   const {searchValue} = useContext(SearchContext)
   const dispatch = useDispatch<AppDispatchType>()

   const [items, setItems] = useState<PizzaType[]>([])
   const [isLoading, setIsLoading] = useState<boolean>(true)

   const array = [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined]
   const skeleton = array.map((_, index) => <Skeleton key={index}/>)
   const pizzas = items.map((obj) => (
      <PizzaBlock key={obj.id} {...obj}/>
   ))

   useEffect(() => {
      setIsLoading(true)

      const sortBy = sort.sortProperty.replace('-', '')
      const order = sort.sortProperty.includes('-') ? 'asc' : 'desc'
      const category = categoryId > 0 ? `category=${categoryId}` : ''
      const search = searchValue ? `&search=${searchValue}` : ''

      pizzasAPI.getPizzas(currentPage, sortBy, category, search, order)
         .then((res) => {
            setItems(res.data)
            setIsLoading(false)
         })
      window.scroll(0, 0)
   }, [categoryId, sort, searchValue, currentPage])

   const onClickCategory = (categoryId: number) => {
      dispatch(setCategoryId(categoryId))
   }

   const onChangePage = (num: number) => {
      dispatch(setCurrentPage(num))
   }

   return (
      <div className='container'>
         <div className="contentTop">
            <Categories categoryID={categoryId} onClickCategory={onClickCategory}/>
            <Sort/>
         </div>
         <h2 className="contentTitle">Все пиццы</h2>
         <div className="contentItems">
            {isLoading ? skeleton : pizzas}
         </div>
         <Pagination currentPage={currentPage} onChangePage={onChangePage}/>
      </div>
   );
};
