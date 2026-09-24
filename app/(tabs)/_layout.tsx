import React from "react";
import { Tabs } from "expo-router";
import TabBarIcon from "../../src/components/navigation/TabBarIcon";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        sceneContainerStyle: { flex: 1 },
        tabBarActiveTintColor: "#6B3AC2",
        tabBarInactiveTintColor: "#A09BB8",
        tabBarShowLabel: false, // Labels live inside the pill icon
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopColor: "#E4DFEF",
          borderTopWidth: 1,
          height: 76,
          paddingBottom: 12,
          paddingTop: 10,
          paddingHorizontal: 8,
          shadowColor: "#6B3AC2",
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.1,
          shadowRadius: 16,
          elevation: 16,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="home" color={color} focused={focused} label="Home" />
          ),
        }}
      />
      <Tabs.Screen
        name="jobs"
        options={{
          title: "Jobs",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="briefcase" color={color} focused={focused} label="Jobs" />
          ),
        }}
      />
      <Tabs.Screen
        name="browse"
        options={{
          title: "Browse",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="search" color={color} focused={focused} label="Browse" />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="user" color={color} focused={focused} label="Profile" />
          ),
        }}
      />
    </Tabs>
  );
}
