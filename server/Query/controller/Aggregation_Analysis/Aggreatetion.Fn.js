
import { RegisterGet  } from '../../Model/Student.js';

export const aggregatefn = async (req, res) => {

  const users=await RegisterGet.aggregate([
  {
    $facet: {
      body: [
        {
          $match: {
            isEligible: true
          }
        },
        {$limit:5}
      ],

      Enclude: [
        {
          $project: {
            _id: 0,
            name: 1,
            country: 1
          }
        },

        {$limit:20}
      ],

      documentCount: [
        {
          $count: "countDocument"
        }
      ],

      checkminmaxAge:[{$group:{_id:null , min:{$min:'$age'} , max:{$max:'$age'} ,Avg:{$avg:'$age'} , count:{$sum:1}}}],

      removeDuplcate:[ {
    $group: {
      _id: "$age"
    }
  },
  {
    $sort: {
      _id: 1
    }
  }]


  , firstfiveage:[{$sort:{age:1}} ,{$limit:5}] ,
  lastfiveage:[{$sort:{age:-1}} , {$limit:5}],

checkAdultStudent:[
  {
    $project: {
      adultage: {
        $cond: [
          { $gte: ["$age", 18] },
          {
            $concat: [
              { $toUpper: "$name" },
              "--",
              { $toUpper: "$country" }
            ]
          },
          "NOT_ADULT"
        ]
      }
    }
  },{$limit:5}
]
,

CheckNumberAgeGroup:[
  {
    $group: {
      _id: "$age",
      count: { $sum: 1 }
    }
  },
  {
    $sort: {
      _id: 1
    }
  }
]
,

RangBoundarires:[
        {
          $bucket: {
            groupBy: "$age",
            boundaries: [18, 30, 50],
            default: "50+",
            output: {
              count: { $sum: 1 },
              maxAge: { $max: "$age" },
              minAge: { $min: "$age" }
            }
          }
        }
      ],

      eligibleStats: [
  {
    $group: {
      _id: "$isEligible",
      count: {
        $sum: 1
      }
    }
  }
]

    }
  }
])


return  users
   

};

