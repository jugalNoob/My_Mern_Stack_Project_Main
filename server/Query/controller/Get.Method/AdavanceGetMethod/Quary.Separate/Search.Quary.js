// utils/queryBuilder.js

export const buildStudentQuery = (queryParams) => {
  const {
    name,
    country,
    email,
    bio,
    bloodGroup,
    age,
    age_gte,
    age_lte,
    price,
    price_gte,
    price_lte,

    ones,
    twos,
  } = queryParams;

  const query = {};

  // 🔹 Text Search (Regex)
  if (name) query.name = { $regex: name, $options: "i" };
  if (country) query.country = { $regex: country, $options: "i" };
  if (email) query.email = { $regex: email, $options: "i" };
  if (bio) query.bio = { $regex: bio, $options: "i" };
  if (bloodGroup) query.bloodGroup = { $regex: bloodGroup, $options: "i" };

  // 🔹 Age Filters
  if (age) query.age = Number(age);
  if (age_gte || age_lte) {
    query.age = {};
    if (age_gte) query.age.$gte = Number(age_gte);
    if (age_lte) query.age.$lte = Number(age_lte);
  }

  // 🔹 Price Filters
  if (price) query.price = Number(price);
  if (price_gte || price_lte) {
    query.price = {};
    if (price_gte) query.price.$gte = Number(price_gte);
    if (price_lte) query.price.$lte = Number(price_lte);
  }


   // 🔹 Hobbies (Multi search)
  if (ones && twos) {
    query.hobbies = { $in: [ones, twos] };
  }




  return query;
};


// Search Link This URL  ------------------>>
// http://localhost:8000/get?name&email&country=japan&page=1&limit=10
// http://localhost:8000/get?name&email&country&bloodGroup=A-&page=1&limit=10
//http://localhost:8000/get?name&email&country&bloodGroup&age=23&page=1&limit=10 
//http://localhost:8000/get?name&email&country&bloodGroup&age_gtl=25&age_lte=20&page=1&limit=10
//http://localhost:8000/get?name&email&country&bloodGroup&age&price=3136&page=1&limit=10




//  http://localhost:8000/get?email=frostmarcus@yahoo.com&page=1&limit=10
//  http://localhost:8000/get?name=Nicholas&email=frostmarcus@yahoo.com&page=1&limit=10

// http://localhost:8000/get?bio=I%20am%20into%20tech%20and%20entertainment.&page=1&limit=10


// 🏆 Final Advanced Version (Real Interview Level)
// export const buildStudentQuery = (queryParams) => {
//   const { name, country, email, bio, bloodGroup, search } = queryParams;

//   const query = {};

//   if (name) query.name = { $regex: name, $options: "i" };

//   if (country)
//     query.country = Array.isArray(country)
//       ? { $in: country }
//       : country;

//   if (email) query.email = email;

//   if (bio) query.bio = { $regex: bio, $options: "i" };

//   if (bloodGroup)
//     query.bloodGroup = Array.isArray(bloodGroup)
//       ? { $in: bloodGroup }
//       : bloodGroup;

//   if (search) {
//     query.$or = [
//       { name: { $regex: search, $options: "i" } },
//       { email: { $regex: search, $options: "i" } },
//       { bio: { $regex: search, $options: "i" } },
//     ];
//   }

//   return query;
// };


// 🔥 Make this scalable for 1M+ records


// 🚀 Even Better (Professional Way)

// Instead of ones, twos — use this:

// /get?hobbies=swimming,football


// Then:

// if (queryParams.hobbies) {
//   const hobbyArray = queryParams.hobbies.split(",");
//   query.hobbies = { $in: hobbyArray };
// }


// Much cleaner.
// Much scalable.
// Interview-ready.

// If you want next level:

// 🔥 $all vs $in difference

// 🔥 Multi-field OR search

// 🔥 Global search (single search box like Amazon)

// 🔥 Full text index

// Tell me which level you want 🚀