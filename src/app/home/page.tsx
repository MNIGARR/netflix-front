/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useState } from "react";
import styles from "../../../styles/home.module.css";

type MediaItem = {
  id: number;
  title?: string;
  name?: string;
  overview: string;
  backdrop_path: string;
  poster_path: string;
};

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<"home" | "tv" | "movie">("home");
  const [featured, setFeatured] = useState<MediaItem | null>(null);
  const [list, setList] = useState<MediaItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (activeTab === "home") {
        const movieRes = await fetch("http://localhost:5001/api/v1/movie/trending");
        const tvRes = await fetch("http://localhost:5001/api/v1/tv/trending");
        const movieData = await movieRes.json();
        const tvData = await tvRes.json();
        const combined = [...movieData.content, ...tvData.content];
        const random = combined[Math.floor(Math.random() * combined.length)];
        setFeatured(random);
      } else {
        const url =
          activeTab === "tv"
            ? "http://localhost:5001/api/v1/tv/trending"
            : "http://localhost:5001/api/v1/movie/trending";
        const res = await fetch(url);
        const data = await res.json();
        setList(data.content);
      }
    };

    fetchData();
  }, [activeTab]);

  return (
    <div className={styles.container}>
      <div className={styles.navbar}>
        <div className={styles.logo}>NETFLIX</div>
        <div
          className={`${styles.navItem} ${activeTab === "home" && styles.active}`}
          onClick={() => setActiveTab("home")}
        >
          Home
        </div>
        <div
          className={`${styles.navItem} ${activeTab === "tv" && styles.active}`}
          onClick={() => setActiveTab("tv")}
        >
          TV Shows
        </div>
        <div
          className={`${styles.navItem} ${activeTab === "movie" && styles.active}`}
          onClick={() => setActiveTab("movie")}
        >
          Movies
        </div>
      </div>

      {activeTab === "home" && featured && (
        <div
          className={styles.banner}
          style={{
            backgroundImage: `url(https://image.tmdb.org/t/p/original${featured.backdrop_path})`,
          }}
        >
          <div className={styles.bannerContent}>
            <h1>{featured.title || featured.name}</h1>
            <p>{featured.overview}</p>
            <div className={styles.buttonGroup}>
              <button className={styles.playButton}>Play</button>
              <button className={styles.infoButton}>More Info</button>
            </div>
          </div>
        </div>
      )}

      {(activeTab === "tv" || activeTab === "movie") && (
        <div className={styles.grid}>
          {list.map((item) => (
            <div key={item.id} className={styles.card}>
              <img
                src={`https://image.tmdb.org/t/p/w300${item.poster_path}`}
                alt={item.title || item.name}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
