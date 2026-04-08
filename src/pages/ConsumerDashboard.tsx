
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, FileText, Heart, Package, Settings, ShoppingBag, User } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { mockOrders } from "@/lib/mockData";

const ConsumerDashboard: React.FC = () => {
  const { currentUser, language } = useApp();
  const [activeTab, setActiveTab] = useState("orders");
  
  // Filter for this consumer's orders
  const consumerOrders = currentUser ? mockOrders.filter(o => o.customerId === currentUser.id) : [];
  
  if (!currentUser || currentUser.role !== "consumer") {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">
          {language === "english" ? "Access Denied" : "அணுகல் மறுக்கப்பட்டது"}
        </h2>
        <p>
          {language === "english" 
            ? "You need to be logged in as a consumer to view this page." 
            : "இந்தப் பக்கத்தைப் பார்க்க நீங்கள் நுகர்வோராக உள்நுழைய வேண்டும்."}
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">
            {language === "english" ? "My Account" : "எனது கணக்கு"}
          </h1>
          <p className="text-gray-600">
            {language === "english" ? "Welcome back" : "மீண்டும் வரவேற்கிறோம்"}, {currentUser.name}
          </p>
        </div>
        
        <div className="flex mt-4 md:mt-0">
          <Button variant="outline" className="mr-2" size="icon">
            <Bell size={18} />
          </Button>
          <Button variant="outline" size="icon">
            <Settings size={18} />
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="orders" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-gray-100">
          <TabsTrigger value="orders">
            {language === "english" ? "My Orders" : "எனது ஆர்டர்கள்"}
          </TabsTrigger>
          <TabsTrigger value="favorites">
            {language === "english" ? "Favorites" : "பிடித்தவை"}
          </TabsTrigger>
          <TabsTrigger value="profile">
            {language === "english" ? "Profile" : "சுயவிவரம்"}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="orders" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">
              {language === "english" ? "Order History" : "ஆர்டர் வரலாறு"}
            </h2>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" className="border-2 border-vivasayi-green">
                {language === "english" ? "All Orders" : "அனைத்து ஆர்டர்களும்"}
              </Button>
              <Button variant="outline" size="sm">
                {language === "english" ? "Recent" : "சமீபத்தியவை"}
              </Button>
            </div>
          </div>
          
          <Card>
            <CardContent className="p-0">
              {consumerOrders.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 border-b">
                        <th className="text-left py-4 px-6">
                          {language === "english" ? "Order" : "ஆர்டர்"}
                        </th>
                        <th className="text-left py-4 px-6">
                          {language === "english" ? "Date" : "தேதி"}
                        </th>
                        <th className="text-left py-4 px-6">
                          {language === "english" ? "Amount" : "தொகை"}
                        </th>
                        <th className="text-left py-4 px-6">
                          {language === "english" ? "Status" : "நிலை"}
                        </th>
                        <th className="text-left py-4 px-6">
                          {language === "english" ? "Actions" : "செயல்கள்"}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {consumerOrders.map(order => (
                        <tr key={order.id} className="border-b">
                          <td className="py-4 px-6">
                            <div>
                              <p className="font-medium">#{order.id}</p>
                              <p className="text-xs text-gray-500">
                                {order.items.length} {language === "english" ? "items" : "பொருட்கள்"}
                              </p>
                            </div>
                          </td>
                          <td className="py-4 px-6">{order.orderDate}</td>
                          <td className="py-4 px-6">₹{order.totalAmount}</td>
                          <td className="py-4 px-6">
                            <span className={`px-2 py-1 rounded text-xs ${
                              order.status === "delivered" ? "bg-green-100 text-green-800" :
                              order.status === "shipped" ? "bg-blue-100 text-blue-800" :
                              order.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                              "bg-gray-100 text-gray-800"
                            }`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm" className="flex items-center">
                                <FileText size={14} className="mr-1" />
                                {language === "english" ? "Details" : "விவரங்கள்"}
                              </Button>
                              <Button variant="outline" size="sm" className="flex items-center">
                                <ShoppingBag size={14} className="mr-1" />
                                {language === "english" ? "Reorder" : "மறுஆர்டர்"}
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Package size={64} className="mx-auto text-gray-300 mb-4" />
                  <h3 className="text-xl font-medium mb-2">
                    {language === "english" ? "No Orders Yet" : "இதுவரை ஆர்டர்கள் இல்லை"}
                  </h3>
                  <p className="text-gray-500 mb-4">
                    {language === "english" ? "You haven't placed any orders yet" : "நீங்கள் இதுவரை எந்த ஆர்டர்களையும் வைக்கவில்லை"}
                  </p>
                  <Button className="bg-vivasayi-green hover:bg-vivasayi-teal">
                    {language === "english" ? "Start Shopping" : "ஷாப்பிங் தொடங்க"}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
          
          {consumerOrders.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>
                  {language === "english" ? "Order Tracking" : "ஆர்டர் கண்காணிப்பு"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center">
                    <div className="relative">
                      <div className="h-12 w-12 rounded-full flex items-center justify-center bg-green-100 border-4 border-green-500">
                        <span className="text-green-500 text-xl">✓</span>
                      </div>
                      <div className="absolute h-16 w-0.5 bg-gray-300 top-12 left-1/2 transform -translate-x-1/2"></div>
                    </div>
                    <div className="ml-4">
                      <h3 className="font-semibold">
                        {language === "english" ? "Order Confirmed" : "ஆர்டர் உறுதிசெய்யப்பட்டது"}
                      </h3>
                      <p className="text-sm text-gray-500">May 7, 2023 at 10:30 AM</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="relative">
                      <div className="h-12 w-12 rounded-full flex items-center justify-center bg-green-100 border-4 border-green-500">
                        <span className="text-green-500 text-xl">✓</span>
                      </div>
                      <div className="absolute h-16 w-0.5 bg-gray-300 top-12 left-1/2 transform -translate-x-1/2"></div>
                    </div>
                    <div className="ml-4">
                      <h3 className="font-semibold">
                        {language === "english" ? "Processing" : "செயலாக்கப்படுகிறது"}
                      </h3>
                      <p className="text-sm text-gray-500">May 7, 2023 at 11:45 AM</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="relative">
                      <div className="h-12 w-12 rounded-full flex items-center justify-center bg-blue-100 border-4 border-blue-500">
                        <span className="text-blue-500">→</span>
                      </div>
                      <div className="absolute h-16 w-0.5 bg-gray-300 top-12 left-1/2 transform -translate-x-1/2"></div>
                    </div>
                    <div className="ml-4">
                      <h3 className="font-semibold">
                        {language === "english" ? "Shipped" : "அனுப்பப்பட்டது"}
                      </h3>
                      <p className="text-sm text-gray-500">May 8, 2023</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="relative">
                      <div className="h-12 w-12 rounded-full flex items-center justify-center bg-gray-100 border-2 border-gray-300">
                        <span className="text-gray-500">?</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="font-semibold">
                        {language === "english" ? "Delivered" : "வழங்கப்பட்டது"}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {language === "english" ? "Expected on" : "எதிர்பார்க்கப்பட்ட தேதி"} May 9, 2023
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="favorites" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>
                {language === "english" ? "Favorite Products" : "பிடித்த தயாரிப்புகள்"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Heart size={64} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-medium mb-2">
                  {language === "english" ? "No Favorites Yet" : "இன்னும் பிடித்தவை எதுவும் இல்லை"}
                </h3>
                <p className="text-gray-500 mb-4">
                  {language === "english" 
                    ? "Save your favorite products for quick access" 
                    : "விரைவான அணுகலுக்கு உங்களுக்குப் பிடித்த தயாரிப்புகளைச் சேமிக்கவும்"}
                </p>
                <Button className="bg-vivasayi-green hover:bg-vivasayi-teal">
                  {language === "english" ? "Browse Products" : "தயாரிப்புகளைப் பார்க்க"}
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>
                {language === "english" ? "Favorite Farmers" : "பிடித்த விவசாயிகள்"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <User size={64} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-medium mb-2">
                  {language === "english" ? "No Favorite Farmers Yet" : "இன்னும் பிடித்த விவசாயிகள் எவரும் இல்லை"}
                </h3>
                <p className="text-gray-500 mb-4">
                  {language === "english" 
                    ? "Save your favorite farmers to see their latest products" 
                    : "அவர்களின் சமீபத்திய தயாரிப்புகளைக் காண உங்களுக்குப் பிடித்த விவசாயிகளைச் சேமிக்கவும்"}
                </p>
                <Button className="bg-vivasayi-green hover:bg-vivasayi-teal">
                  {language === "english" ? "Discover Farmers" : "விவசாயிகளைக் கண்டறியுங்கள்"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>
                {language === "english" ? "Personal Information" : "தனிப்பட்ட தகவல்"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center">
                  <div className="md:w-1/4 font-medium text-gray-500">
                    {language === "english" ? "Name" : "பெயர்"}
                  </div>
                  <div className="md:w-3/4 mt-1 md:mt-0">
                    {currentUser.name}
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row md:items-center">
                  <div className="md:w-1/4 font-medium text-gray-500">
                    {language === "english" ? "Email" : "மின்னஞ்சல்"}
                  </div>
                  <div className="md:w-3/4 mt-1 md:mt-0">
                    {currentUser.email}
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row md:items-center">
                  <div className="md:w-1/4 font-medium text-gray-500">
                    {language === "english" ? "Phone" : "தொலைபேசி"}
                  </div>
                  <div className="md:w-3/4 mt-1 md:mt-0">
                    {currentUser.phone}
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row md:items-center">
                  <div className="md:w-1/4 font-medium text-gray-500">
                    {language === "english" ? "Address" : "முகவரி"}
                  </div>
                  <div className="md:w-3/4 mt-1 md:mt-0">
                    {currentUser.address || (language === "english" ? "No address saved" : "முகவரி சேமிக்கப்படவில்லை")}
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button className="bg-vivasayi-green hover:bg-vivasayi-teal">
                    {language === "english" ? "Edit Profile" : "சுயவிவரத்தைத் திருத்து"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>
                {language === "english" ? "Account Settings" : "கணக்கு அமைப்புகள்"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">
                      {language === "english" ? "Password" : "கடவுச்சொல்"}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {language === "english" ? "Change your password" : "உங்கள் கடவுச்சொல்லை மாற்றவும்"}
                    </p>
                  </div>
                  <Button variant="outline">
                    {language === "english" ? "Change" : "மாற்று"}
                  </Button>
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">
                      {language === "english" ? "Notifications" : "அறிவிப்புகள்"}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {language === "english" ? "Manage notification preferences" : "அறிவிப்பு விருப்பங்களை நிர்வகிக்கவும்"}
                    </p>
                  </div>
                  <Button variant="outline">
                    {language === "english" ? "Manage" : "நிர்வகி"}
                  </Button>
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">
                      {language === "english" ? "Delete Account" : "கணக்கை நீக்கு"}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {language === "english" ? "Permanently delete your account" : "உங்கள் கணக்கை நிரந்தரமாக நீக்கவும்"}
                    </p>
                  </div>
                  <Button variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200">
                    {language === "english" ? "Delete" : "நீக்கு"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ConsumerDashboard;
