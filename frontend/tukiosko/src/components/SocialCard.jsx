export default function SocialCard({ icon, color, count, trend }){
    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
            <i className={`fab ${icon} ${color} text-3xl`}></i>
            <div className="text-right">
            <p className="text-2xl font-bold text-gray-700">{count}</p>
            <p className="text-sm text-[#1de9b6]">{trend} <span className="text-gray-400">Total Likes</span></p>
            </div>
        </div>
        </div>
    )
};