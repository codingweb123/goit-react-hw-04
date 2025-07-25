import { createPortal } from "react-dom"
import css from "./MovieModal.module.css"
import { useEffect } from "react"
import type { Movie } from "../../types/movie"

interface MovieModalProps {
	onClose: () => void
	movie: Movie
}

export default function MovieModal({
	onClose,
	movie: { title, overview, release_date, backdrop_path, vote_average },
}: MovieModalProps) {
	const onBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
		if (event.target === event.currentTarget) {
			onClose()
		}
	}

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				onClose()
			}
		}

		document.addEventListener("keydown", handleKeyDown)
		document.body.style.overflow = "hidden"

		return () => {
			document.removeEventListener("keydown", handleKeyDown)
			document.body.style.overflow = ""
		}
	}, [onClose])

	return createPortal(
		<div
			className={css.backdrop}
			onClick={onBackdropClick}
			role="dialog"
			aria-modal="true">
			<div className={css.modal}>
				<button
					className={css.closeButton}
					aria-label="Close modal"
					onClick={onClose}>
					&times;
				</button>
				<img
					src={
						backdrop_path
							? "https://image.tmdb.org/t/p/original/" + backdrop_path
							: "https://img.freepik.com/free-photo/assortment-cinema-elements-red-background-with-copy-space_23-2148457848.jpg"
					}
					alt={title}
					className={css.image}
				/>
				<div className={css.content}>
					<h2>{title}</h2>
					<p>{overview}</p>
					<p>
						<strong>Release Date:</strong> {release_date}
					</p>
					<p>
						<strong>Rating:</strong> {vote_average}/10
					</p>
				</div>
			</div>
		</div>,
		document.body
	)
}
