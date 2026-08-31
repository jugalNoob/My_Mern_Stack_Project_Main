import React from 'react'
import {
  createBrowserRouter, RouterProvider
} from 'react-router-dom'

import Form from "./page/Form_User/Form"
import Get from './page/Get_User/Get'
import Home from "./page/Home"
import Update from './page/Update_User/Update'
import Detele from './page/Delete_Api/Detele'
import AnalyseP from './page/Analyse_Api/AnalyseP'


const router=createBrowserRouter([  /// install react router https://medium.com/@adebayosilas/introduction-to-react-router-v6-4-6-11-1-f56c7710282e
  
  {

    path:'/',
    element:<Home/>
  },

  {
    path:'/get',
    element:<Get/>
  },

  {
    path:'/form',
    element:<Form/>
  }
  ,
  {
    path:'/update',
    element:<Update/>
  },

  {
    path:'/delete',
    element:<Detele/>
  },


  
  {
    path:'/anayles',
    element:<AnalyseP/>
  }


])

function App(){


  return <RouterProvider router={router} />
}
export default App