import noDataImage from '../assets/nothing here yet.png'

const NoData = () => {
    return (
        <div className='flex flex-col items-center justify-center p-4 gap-2'>
            <img src={noDataImage}
                alt="No Data"
                className='w-36'
            />

            <p className='text-neutral-500'>No Data</p>
        </div>
    )
}

export default NoData
