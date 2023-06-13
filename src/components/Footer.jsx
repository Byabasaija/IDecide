

const Footer = () => {
  return (
 
<footer class="bg-white shadow dark:bg-gray-900">
    <div class="w-full max-w-screen-xl mx-auto p-4 md:py-8">
        <div class="sm:flex sm:items-center sm:justify-between">
            <a href="https://flowbite.com/" class="flex items-center mb-4 sm:mb-0 font-bold text-2xl text-white">
                I
                <span class="self-center text-2xl font-semibold whitespace-nowrap text-green-600">Decide</span>
            </a>
            <ul class="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-500 sm:mb-0 dark:text-gray-400">
                <li>
                    <a href="#" class="mr-4 hover:underline md:mr-6 ">Github</a>
                </li>
                <li>
                    <a href="#" class="mr-4 hover:underline md:mr-6">Linkedin</a>
                </li>
                <li>
                    <a href="#" class="mr-4 hover:underline md:mr-6 ">Twitter</a>
                </li>
            </ul>
        </div>
        <hr class="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
        <span class="block text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2023 <a href="https://flowbite.com/" class="hover:underline">IDecide™</a>. All Rights Reserved.</span>
    </div>
</footer>



  )
}

export default Footer
