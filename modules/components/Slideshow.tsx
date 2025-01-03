import React, { useState } from "react"
import { View, Image, TouchableOpacity, StyleSheet, Dimensions, Text, FlatList } from "react-native"

const { width } = Dimensions.get("window")

interface BoatImage {
     id: string
     url: string
     caption: string | null
}

interface SlideshowProps {
     images?: BoatImage[]
}

const Slideshow: React.FC<SlideshowProps> = ({ images }) => {
     const [currentIndex, setCurrentIndex] = useState(0)

     console.log("Slideshow images", images)

     if (!images) {
          return (
               <View style={styles.container}>
                    <Text>No images</Text>
               </View>
          )
     }

     const goToPrevious = () => {
          if (currentIndex > 0) {
               setCurrentIndex((prevIndex) => prevIndex - 1)
          }
     }

     const goToNext = () => {
          if (currentIndex < images.length - 1) {
               setCurrentIndex((prevIndex) => prevIndex + 1)
          }
     }

     return (
          <View style={styles.container}>
               <FlatList
                    data={images}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item }) => {
                         return (
                              <View style={styles.imageContainer}>
                                   <Image source={{ uri: item.url }} style={styles.image} />
                              </View>
                         )
                    }}
                    keyExtractor={(_, index) => index.toString()}
                    onScroll={(event) => {
                         const newIndex = Math.round(event.nativeEvent.contentOffset.x / width)
                         setCurrentIndex(newIndex)
                    }}
                    contentContainerStyle={{ alignItems: "center" }}
                    decelerationRate="fast"
                    snapToInterval={width}
                    snapToAlignment="center"
               />
               <View style={styles.paginationContainer}>
                    {images.map((_, index) => (
                         <View key={index} style={[styles.dot, currentIndex === index ? styles.activeDot : styles.inactiveDot]} />
                    ))}
               </View>
          </View>
     )
}

const styles = StyleSheet.create({
     container: {
          alignItems: "center",
          justifyContent: "center",
     },
     imageContainer: {
          width: width,
          height: 200,
          alignItems: "center",
          justifyContent: "center",
     },
     image: {
          width: "90%",
          height: "100%",
          borderRadius: 8,
     },
     paginationContainer: {
          flexDirection: "row",
          marginTop: 10,
     },
     dot: {
          width: 10,
          height: 10,
          borderRadius: 5,
          marginHorizontal: 4,
     },
     activeDot: {
          backgroundColor: "black",
     },
     inactiveDot: {
          backgroundColor: "gray",
     },
})

export default Slideshow
