import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Float, Cloud, useScroll } from '@react-three/drei';
import * as THREE from 'three';
import { useWeather } from '../context/WeatherContext';
import { useTheme } from '../context/ThemeContext';

const RainParticles = ({ count = 1000 }) => {
    const points = useRef();
    const velocity = useMemo(() => new Float32Array(count).fill(-0.2), [count]);
    const positions = useMemo(() => {
        const pos = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 50;
            pos[i * 3 + 1] = Math.random() * 50;
            pos[i * 3 + 2] = (Math.random() - 0.5) * 50;
        }
        return pos;
    }, [count]);

    useFrame(() => {
        if (!points.current) return;
        const array = points.current.geometry.attributes.position.array;
        for (let i = 0; i < count; i++) {
            array[i * 3 + 1] += velocity[i];
            if (array[i * 3 + 1] < -20) array[i * 3 + 1] = 30;
        }
        points.current.geometry.attributes.position.needsUpdate = true;
    });

    return (
        <points ref={points}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={positions.length / 3}
                    array={positions}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial size={0.1} color="#3b82f6" transparent opacity={0.6} />
        </points>
    );
};

const SnowParticles = ({ count = 800 }) => {
    const points = useRef();
    const positions = useMemo(() => {
        const pos = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 50;
            pos[i * 3 + 1] = Math.random() * 50;
            pos[i * 3 + 2] = (Math.random() - 0.5) * 50;
        }
        return pos;
    }, [count]);

    useFrame((state) => {
        if (!points.current) return;
        const time = state.clock.getElapsedTime();
        const array = points.current.geometry.attributes.position.array;
        for (let i = 0; i < count; i++) {
            array[i * 3 + 1] -= 0.05;
            array[i * 3] += Math.sin(time + i) * 0.01;
            if (array[i * 3 + 1] < -20) array[i * 3 + 1] = 30;
        }
        points.current.geometry.attributes.position.needsUpdate = true;
    });

    return (
        <points ref={points}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={positions.length / 3}
                    array={positions}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial size={0.15} color="#ffffff" transparent opacity={0.8} />
        </points>
    );
};

const WeatherScene = () => {
    const { currentWeather } = useWeather();
    const { isDarkMode } = useTheme();

    const condition = currentWeather?.weather?.[0]?.main?.toLowerCase() || 'clear';

    return (
        <>
            <ambientLight intensity={isDarkMode ? 0.2 : 0.5} />
            <pointLight position={[10, 10, 10]} intensity={isDarkMode ? 0.5 : 1} />

            {isDarkMode && <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />}

            {condition.includes('cloud') && (
                <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                    <Cloud opacity={isDarkMode ? 0.3 : 0.5} speed={0.4} width={10} depth={1.5} segments={20} position={[-5, 5, -10]} />
                    <Cloud opacity={isDarkMode ? 0.2 : 0.4} speed={0.3} width={10} depth={1.2} segments={15} position={[8, 2, -15]} />
                </Float>
            )}

            {(condition.includes('rain') || condition.includes('drizzle')) && <RainParticles />}
            {condition.includes('snow') && <SnowParticles />}

            {condition.includes('clear') && !isDarkMode && (
                <mesh position={[10, 10, -20]}>
                    <sphereGeometry args={[2, 32, 32]} />
                    <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={2} />
                </mesh>
            )}
        </>
    );
};

const WeatherBackground = () => {
    return (
        <div className="fixed inset-0 -z-10 pointer-events-none">
            <Canvas camera={{ position: [0, 0, 15], fov: 60 }}>
                <WeatherScene />
            </Canvas>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/20 to-background/50" />
        </div>
    );
};

export default WeatherBackground;
