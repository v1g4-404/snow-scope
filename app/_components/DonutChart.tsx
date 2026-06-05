import { Chart, registerables } from "chart.js"
import { Doughnut } from "react-chartjs-2"
Chart.register(...registerables)

type Props = {
  beginnerRatio: number,
  intermediateRatio: number,
  advancedRatio: number,
  groomedRatio: number,
  ungroomedRatio: number,
}

export const DonutChart = ({ beginnerRatio, intermediateRatio, advancedRatio, groomedRatio, ungroomedRatio }: Props) => {

  const levelData = {
    datasets: [{
      data: [beginnerRatio, intermediateRatio, advancedRatio],
      backgroundColor: ['#378ADD', '#EF9F27', '#E24B4A'],
      borderWidth: 0,
    }]
  }

  const groomedData = {
    datasets: [{
      data: [groomedRatio, ungroomedRatio],
      backgroundColor: ['#9FE1CB', '#378ADD'],
      borderWidth: 0,
    }]
  }

  const options = {
    plugins: {
      tooltip: { enabled: false },
      legend: { display: false },
    }
  }

  return (
    <div className="flex gap-4 justify-center mt-6">
      <div className="flex flex-col items-center gap-2">
        <Doughnut data={levelData} options={options} className="w-32 h-32" />
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#378ADD]" />
            <span className="text-xs text-[#64748B]">初心者 {beginnerRatio}%</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#EF9F27]" />
            <span className="text-xs text-[#64748B]">中級者 {intermediateRatio}%</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#E24B4A]" />
            <span className="text-xs text-[#64748B]">上級者 {advancedRatio}%</span>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Doughnut data={groomedData} options={options} className="w-32 h-32" />
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#9FE1CB]" />
            <span className="text-xs text-[#64748B]">圧雪 {groomedRatio}%</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#378ADD]" />
            <span className="text-xs text-[#64748B]">非圧雪 {ungroomedRatio}%</span>
          </div>
        </div>
      </div>
    </div>
  )
}