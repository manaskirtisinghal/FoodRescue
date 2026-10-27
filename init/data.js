const foodData = [
  {
    name: "Vegetable Pizza",
    quantity: 12,
    type: "Vegetarian",
    location: "MIT Food Court",
    description: "Fresh vegetable pizzas left after the evening rush.",
    availableUntil: new Date(Date.now() + 2 * 60 * 60 * 1000),
    providerName: "Campus Cafe",
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800",
    status: "available"
  },

  {
    name: "Veg Sandwich",
    quantity: 18,
    type: "Vegetarian",
    location: "Manipal Central Cafeteria",
    description: "Fresh sandwiches prepared today.",
    availableUntil: new Date(Date.now() + 3 * 60 * 60 * 1000),
    providerName: "Green Bites",
    image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800",
    status: "available"
  },

  {
    name: "Rice and Dal",
    quantity: 25,
    type: "Vegetarian",
    location: "Student Hostel Block A",
    description: "Freshly prepared rice and dal available for pickup.",
    availableUntil: new Date(Date.now() + 90 * 60 * 1000),
    providerName: "Hostel Mess",
    image: "https://images.unsplash.com/photo-1596560548464-f010549b84d7?w=800",
    status: "available"
  },

  {
    name: "Paneer Wrap",
    quantity: 10,
    type: "Vegetarian",
    location: "Student Plaza",
    description: "Paneer wraps remaining from today's lunch service.",
    availableUntil: new Date(Date.now() + 4 * 60 * 60 * 1000),
    providerName: "Wrap House",
    image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=800",
    status: "available"
  },

  {
    name: "Fruit Bowl",
    quantity: 8,
    type: "Vegan",
    location: "University Cafe",
    description: "Mixed fresh fruit bowls available for immediate pickup.",
    availableUntil: new Date(Date.now() + 60 * 60 * 1000),
    providerName: "Fresh Corner",
    image: "https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=800",
    status: "available"
  },

  {
    name: "Chicken Biryani",
    quantity: 15,
    type: "Non-Vegetarian",
    location: "Campus Dining Hall",
    description: "Fresh biryani portions remaining from dinner service.",
    availableUntil: new Date(Date.now() + 2 * 60 * 60 * 1000),
    providerName: "Spice Kitchen",
    image: "https://images.unsplash.com/photo-1563379091339-03246963d96c?w=800",
    status: "available"
  }
];

module.exports = {data:foodData};