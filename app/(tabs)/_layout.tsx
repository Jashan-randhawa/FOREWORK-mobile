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
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopColor: "#E4DFEF",
          borderTopWidth: 1,
          height: 68,
          paddingBottom: 10,
          paddingTop: 8,
          shadowColor: "#6B3AC2",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.08,
          shadowRadius: 12,
          elevation: 12,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "700",
          marginTop: 2,
        },
        tabBarIconStyle: {
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="home" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="jobs"
        options={{
          title: "Jobs",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="briefcase" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="browse"
        options={{
          title: "Browse",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="search" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="user" color={color} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}
