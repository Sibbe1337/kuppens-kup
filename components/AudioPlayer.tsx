import React, { useState, useRef, useEffect, useCallback } from 'react'
import { Play, Pause, SkipBack, SkipForward, Repeat, Volume2, VolumeX, Maximize, Minimize } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import WaveSurfer from 'wavesurfer.js'
import { usePlaylist } from '@/contexts/PlaylistContext'

interface AudioPlayerProps {
  src: string
  title: string
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ src, title }) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [isLooping, setIsLooping] = useState(false)
  const [playbackSpeed, setPlaybackSpeed] = useState(1)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const waveformRef = useRef<HTMLDivElement>(null)
  const wavesurferRef = useRef<WaveSurfer | null>(null)
  const { playlist, currentTrackIndex, nextTrack, previousTrack } = usePlaylist()

  const initializeWavesurfer = useCallback(() => {
    if (waveformRef.current && !wavesurferRef.current) {
      wavesurferRef.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: 'violet',
        progressColor: 'purple',
        responsive: true,
        cursorWidth: 1,
        cursorColor: 'lightgray',
        barWidth: 2,
        barRadius: 3,
        barGap: 3,
        height: 60,
      })

      wavesurferRef.current.load(src)

      wavesurferRef.current.on('ready', () => {
        setDuration(wavesurferRef.current!.getDuration())
      })

      wavesurferRef.current.on('audioprocess', () => {
        setCurrentTime(wavesurferRef.current!.getCurrentTime())
      })

      wavesurferRef.current.on('seek', () => {
        setCurrentTime(wavesurferRef.current!.getCurrentTime())
      })
    }
  }, [src])

  useEffect(() => {
    initializeWavesurfer()

    return () => {
      if (wavesurferRef.current) {
        wavesurferRef.current.destroy()
      }
    }
  }, [initializeWavesurfer])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const setAudioData = () => {
      setDuration(audio.duration)
      setCurrentTime(audio.currentTime)
    }

    const setAudioTime = () => setCurrentTime(audio.currentTime)

    audio.addEventListener('loadeddata', setAudioData)
    audio.addEventListener('timeupdate', setAudioTime)

    return () => {
      audio.removeEventListener('loadeddata', setAudioData)
      audio.removeEventListener('timeupdate', setAudioTime)
    }
  }, [])

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
        wavesurferRef.current?.pause()
      } else {
        audioRef.current.play()
        wavesurferRef.current?.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleTimeChange = (newValue: number[]) => {
    const [time] = newValue
    if (audioRef.current) {
      audioRef.current.currentTime = time
      setCurrentTime(time)
      wavesurferRef.current?.seekTo(time / duration)
    }
  }

  const handleVolumeChange = (newValue: number[]) => {
    const [vol] = newValue
    setVolume(vol)
    if (audioRef.current) {
      audioRef.current.volume = vol
    }
    wavesurferRef.current?.setVolume(vol)
    setIsMuted(vol === 0)
  }

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted
      wavesurferRef.current?.setMuted(!isMuted)
      setIsMuted(!isMuted)
    }
  }

  const toggleLoop = () => {
    if (audioRef.current) {
      audioRef.current.loop = !isLooping
      setIsLooping(!isLooping)
    }
  }

  const handlePlaybackSpeedChange = (value: string) => {
    const speed = parseFloat(value)
    setPlaybackSpeed(speed)
    if (audioRef.current) {
      audioRef.current.playbackRate = speed
    }
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
        setIsFullscreen(false)
      }
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <div className={`flex flex-col items-center w-full max-w-4xl mx-auto bg-white rounded-lg shadow-md p-4 ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      <h2 className="text-lg font-semibold mb-2" id="audio-player-title">{title}</h2>
      <audio
        ref={audioRef}
        src={src}
        aria-labelledby="audio-player-title"
        loop={isLooping}
        onEnded={() => nextTrack()}
      />
      <div ref={waveformRef} className="w-full mb-4"></div>
      <div className="flex items-center justify-between w-full mb-4">
        <Button 
          onClick={previousTrack} 
          variant="outline" 
          size="sm"
          aria-label="Previous track"
        >
          <SkipBack className="h-4 w-4" aria-hidden="true" />
        </Button>
        <Button 
          onClick={togglePlay} 
          variant="outline" 
          size="sm"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <Pause className="h-4 w-4" aria-hidden="true" /> : <Play className="h-4 w-4" aria-hidden="true" />}
        </Button>
        <Button 
          onClick={nextTrack} 
          variant="outline" 
          size="sm"
          aria-label="Next track"
        >
          <SkipForward className="h-4 w-4" aria-hidden="true" />
        </Button>
        <span className="text-sm" aria-live="polite">
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>
      </div>
      <div className="w-full mb-4">
        <label htmlFor="time-slider" className="sr-only">Track progress</label>
        <Slider
          id="time-slider"
          value={[currentTime]}
          min={0}
          max={duration || 100}
          step={1}
          onValueChange={handleTimeChange}
          className="w-full"
          aria-valuetext={`${formatTime(currentTime)} of ${formatTime(duration)}`}
        />
      </div>
      <div className="flex items-center w-full mb-4">
        <Button 
          onClick={toggleMute} 
          variant="ghost" 
          size="sm"
          aria-label={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <VolumeX className="h-4 w-4" aria-hidden="true" /> : <Volume2 className="h-4 w-4" aria-hidden="true" />}
        </Button>
        <div className="ml-2 flex-grow">
          <label htmlFor="volume-slider" className="sr-only">Volume</label>
          <Slider
            id="volume-slider"
            value={[volume]}
            min={0}
            max={1}
            step={0.1}
            onValueChange={handleVolumeChange}
            className="w-full"
            aria-valuetext={`Volume ${Math.round(volume * 100)}%`}
          />
        </div>
      </div>
      <div className="flex items-center justify-between w-full">
        <Button
          onClick={toggleLoop}
          variant={isLooping ? "secondary" : "outline"}
          size="sm"
          aria-label={isLooping ? "Disable loop" : "Enable loop"}
        >
          <Repeat className="h-4 w-4 mr-2" aria-hidden="true" />
          Loop
        </Button>
        <div className="flex items-center">
          <label htmlFor="playback-speed" className="mr-2 text-sm">Speed:</label>
          <Select value={playbackSpeed.toString()} onValueChange={handlePlaybackSpeedChange}>
            <SelectTrigger id="playback-speed" className="w-[100px]">
              <SelectValue placeholder="Playback Speed" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0.5">0.5x</SelectItem>
              <SelectItem value="0.75">0.75x</SelectItem>
              <SelectItem value="1">1x</SelectItem>
              <SelectItem value="1.25">1.25x</SelectItem>
              <SelectItem value="1.5">1.5x</SelectItem>
              <SelectItem value="2">2x</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button
          onClick={toggleFullscreen}
          variant="outline"
          size="sm"
          aria-label={isFullscreen ? "Exit full screen" : "Enter full screen"}
        >
          {isFullscreen ? <Minimize className="h-4 w-4" aria-hidden="true" /> : <Maximize className="h-4 w-4" aria-hidden="true" />}
        </Button>
      </div>
    </div>
  )
}

