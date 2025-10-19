import React from 'react'

const Loader = ({ name }: { name: string }) => {
    return (
        <div className="flex justify-center py-4">
            <div className="bg-white rounded-lg px-4 py-2 shadow-md flex items-center space-x-2">
                <div className="w-5 h-5 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
                <span className="text-gray-700">{name}</span>
            </div>
        </div>
    )
}

export default Loader