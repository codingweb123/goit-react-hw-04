import { useEffect, useState } from "react"
import ErrorMessage from "../ErrorMessage/ErrorMessage"
import Loader from "../Loader/Loader"
import MovieGrid from "../MovieGrid/MovieGrid"
import MovieModal from "../MovieModal/MovieModal"
import SearchBar from "../SearchBar/SearchBar"
import css from "./App.module.css"
import toast, { Toaster } from "react-hot-toast"
import { type Movie } from "../../types/movie"
import { fetchMovies } from "../../services/movieService"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import ReactPaginate from "react-paginate"

export default function App() {
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
	const [currentMovie, setCurrentMovie] = useState<Movie | null>(null)
	const [page, setPage] = useState<number>(1)
	const [currentQuery, setCurrentQuery] = useState<string>("")

	const modalOpen = () => setIsModalOpen(true)
	const modalClose = () => setIsModalOpen(false)

	const selectMovie = (movie: Movie) => {
		setCurrentMovie(movie)
		modalOpen()
	}

	const {
		data: movies,
		isLoading,
		isError,
		isSuccess,
	} = useQuery({
		queryKey: ["movies", currentQuery, page],
		queryFn: async () => fetchMovies(currentQuery, page),
		placeholderData: keepPreviousData,
		enabled: currentQuery != "",
	})

	const totalPages = movies?.total_pages ?? 1

	const searchSubmit = async (query: string) => {
		setCurrentQuery(query)
		setPage(1)
	}

	useEffect(() => {
		if (movies?.results.length == 0) {
			toast.error("No movies found for your request.")
		}
	}, [movies])

	return (
		<div className={css.app}>
			<Toaster />
			<SearchBar onSubmit={searchSubmit} />
			{isSuccess && totalPages > 1 && (
				<ReactPaginate
					pageCount={totalPages}
					pageRangeDisplayed={5}
					marginPagesDisplayed={1}
					onPageChange={({ selected }) => setPage(selected + 1)}
					forcePage={page - 1}
					containerClassName={css.pagination}
					activeClassName={css.active}
					nextLabel="→"
					previousLabel="←"
				/>
			)}
			{movies && <MovieGrid onSelect={selectMovie} movies={movies.results} />}
			{isLoading && <Loader />}
			{isError && <ErrorMessage />}
			{isModalOpen && currentMovie && (
				<MovieModal onClose={modalClose} movie={currentMovie} />
			)}
		</div>
	)
}
