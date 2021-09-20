


export default function ErrorView({ setError, siteError }) {
    return (
        <div className={`error-view px-8 h-24 shadow-lg w-screen absolute bg-brand-green flex justify-center items-center  transition-all transform duration-300 top-0 ${siteError.showError ? '-translate-y-0' : '-translate-y-full'
            }`}>
            <div className='w-1/2 flex flex-row items-center justify-between'>
                <div className="text-white">{siteError.error}</div>
                <button className="bg-brand-pink px-4 py-2 rounded-md" onClick={() => setError({ showError: false, error: '' })}>Gotcha!</button>
            </div>
        </div>
    )
}