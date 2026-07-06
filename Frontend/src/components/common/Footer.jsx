import React from 'react'

const Footer = () => {
  return (
   <footer className="bg-gray-900 text-gray-300 pt-16 pb-6">
            <div className="max-w-7xl mx-auto px-5 flex justify-around gap-5">
              <div>
                <h3 className="text-red-400 text-xl font-bold mb-4">
                  FarmShop
                </h3>
                <p className="w-70">
                  FarmShop is an online marketplace that connects farmers, shopkeepers, and customers with secure ordering, inventory management, and role-based dashboards.
                </p>
              </div>
    
              
    
              
    
              <div>
                <h3 className="text-red-400 font-semibold mb-4">Contact Us</h3>
                <ul className="space-y-2">
                  <li className="w-50">Chandua Chhittupur, Varanasi, Uttar Pradesh</li>
                  <li>(123) 0542-5596</li>
                </ul>
              </div>
            </div>
    
            <div className="text-center border-t border-gray-700 mt-10 pt-5 text-sm">
              © 2026 FarmShop. All Rights Reserved.
            </div>
          </footer>
  )
}

export default Footer