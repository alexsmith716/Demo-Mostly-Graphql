import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
	useLazyQuery,
	useQuery,
	useApolloClient,
	NetworkStatus,
	gql,
} from '@apollo/client';

import Button from '../../components/Button';
import { GoogleBookBook, } from '../../components/GoogleBookBook';
import { GET_GOOGLE_BOOKS, GET_GOOGLE_BOOK } from '../../graphql/queries/queries.js';


const RESTfulExample = () => {

	const [clientExtract, setClientExtract] = useState(null);
	const [googleBookSearch, setGoogleBookSearch] = useState('');
	const [toggleCacheView, setToggleCacheView] = useState(false);
	const [skipGoogleBooksUseQuery, setSkipGoogleBooksUseQuery] = useState(true);

	const [googleBooksReadCacheDATA, setGoogleBooksReadCacheDATA] = useState(null);
	const [googleBooksLastSearchString, setGoogleBooksLastSearchString] = useState('');
	const [googleBookUseQuerySearch, setGoogleBookUseQuerySearch] = useState('');
	const [lastSearch, setLastSearch] = useState('');

	const [firstLoad, setFirstLoad] = useState(false);

	const client = useApolloClient();

	//	const [getGoogleBooks, {
	//			called,
	//			loading, 
	//			error,
	//			data: googleBooksData,
	//			previousData: googleBooksPreviousData,
	//			refetch,
	//			fetchMore,
	//			networkStatus,
	//		}] = useLazyQuery(
	//			GET_GOOGLE_BOOKS,
	//			{
	//				variables: {
	//					searchString: `${googleBookSearch}`,
	//					orderBy: 'newest',
	//				},
	//				fetchPolicy: 'cache-and-network',
	//				nextFetchPolicy: 'cache-first',
	//				notifyOnNetworkStatusChange: true,
	//				onCompleted: () => {
	//					setFirstLoad(true);
	//				}
	//			}
	//	);

	const [getGoogleBook, {
			loading: googleBookLoading, 
			error: googleBookError,
			data: googleBookData,
		}] = useLazyQuery(
			GET_GOOGLE_BOOK,
	);

	//	@client directive: query and update cache

	const {
			called,
			loading,
			error,
			data: googleBooksUseQueryDATA,
			fetchMore: fetchMore,
			networkStatus,
		} = useQuery(
			GET_GOOGLE_BOOKS,
			{
				variables: {
					searchString: `${googleBookUseQuerySearch}`,
					orderBy: 'newest',
				},
				// fetchPolicy: 'cache-and-network',
				// nextFetchPolicy: 'cache-first',
				notifyOnNetworkStatusChange: true,
				skip: skipGoogleBooksUseQuery,
				onCompleted: () => {
					setSkipGoogleBooksUseQuery(true);
				}
			}
	);

	useEffect(() => {
		if (!googleBooksReadCacheDATA) {
			setGoogleBooksReadCacheDATA(client.readQuery({ query: gql`${GET_GOOGLE_BOOKS}` }));
		}
		if (googleBooksReadCacheDATA) {
			const search = googleBooksReadCacheDATA?.googleBooks?.lastSearchString;
			setLastSearch(search);
		}
		if (lastSearch !== '') {
			if (!googleBooksUseQueryDATA) {
				setGoogleBookUseQuerySearch('kaplan test prep')
			}
		}
		if (googleBookUseQuerySearch) {
			setSkipGoogleBooksUseQuery(false);
		}

		if (toggleCacheView) {
			setClientExtract(client.extract());
		}
		},
		[toggleCacheView, googleBookUseQuerySearch, googleBooksUseQueryDATA, googleBooksReadCacheDATA, lastSearch,]
	);

	return (
		<>
			<Helmet title="REST Example" />

			{/* ---------------------------------------------- */}

			<div className="container">
				{/* ---------------------------------------------- */}

				<h1 className="mt-4 mb-3">REST Example</h1>

				{/* ---------------------------------------------- */}

				<div className="bg-color-ivory container-padding-border-radius-1 text-break mb-5">
					<div className="mb-3">

						<div className="mb-3">
							<h5>getGoogleBooks Data:</h5>
						</div>

						{networkStatus === NetworkStatus.refetch && (
							<p>
								Refetching...
							</p>
						)}

						{loading && (
							<p>
								Loading...
							</p>
						)}

						{googleBookLoading && (
							<p>
								Loading...
							</p>
						)}

						{error && (
							<p>
								Query Error: {error.message}
							</p>
						)}

						{googleBookError && (
							<p>
								Query Error: {googleBookError.message}
							</p>
						)}

						{googleBooksUseQueryDATA && (
							<div>
								{googleBooksUseQueryDATA.googleBooks.books.map((book, index) => (
									<div key={index} className="mb-3 container-padding-border-radius-2">
										<GoogleBookBook book={ book } />
									</div>
								))}
							</div>
						)}

						{googleBookData && googleBookData.googleBook && (
							<div>
								<div className="mb-3">
									<h5>getGoogleBook Data:</h5>
								</div>
									<div key={googleBookData.googleBook.id} className="mb-3 container-padding-border-radius-2">
										<GoogleBookBook book={ googleBookData.googleBook } />
									</div>
							</div>
						)}

						{clientExtract && (
							<div className={!toggleCacheView ? 'text-overflow-ellipsis-one' : ''}>
								<h5>ApolloClient Cache:</h5>
								<div>{JSON.stringify(clientExtract)}</div>
							</div>
						)}
					</div>

					<div className="mb-3">
						<Button
							type="button"
							className="btn-success btn-md"
							onClick={() => setToggleCacheView(!toggleCacheView)}
							buttonText={!clientExtract ? "View Apollo Cache" : "Toggle Cache View"}
						/>
					</div>

					{googleBooksUseQueryDATA && (
						<div className="mb-3">
							<Button
								type="button"
								className="btn-success btn-md"
								onClick={() => refetch()}
								buttonText="RefetchQueryResults"
							/>
						</div>
					)}

					<div className="mb-3">
						<Button
							type="button"
							className="btn-success btn-md"
							onClick={ () => getGoogleBook({ variables: { id: 'uW_zzQEACAAJ' }}) }
							buttonText="Get Book ID: uW_zzQEACAAJ"
						/>
					</div>

					<div className="mb-3">
						<Button
							type="button"
							className="btn-success btn-md"
							// onClick={() => getGoogleBooks({ variables: { searchString: 'kaplan test prep' },})}
							onClick={() => setGoogleBookUseQuerySearch('kaplan test prep')}
							buttonText="Search Kaplan!!!!"
						/>
					</div>

					<div className="mb-3">
						<Button
							type="button"
							className="btn-success btn-md"
							// onClick={() => getGoogleBooks({ variables: { searchString: 'gmat' },})}
							onClick={() => setGoogleBookUseQuerySearch('usmle')}
							buttonText="Search USMLE"
						/>
					</div>

					<div className="mb-3">
						<Button
							type="button"
							className="btn-success btn-md"
							// onClick={() => getGoogleBooks({ variables: { searchString: 'lsat' },})}
							onClick={() => setGoogleBookUseQuerySearch('lsat')}
							buttonText="Search LSAT!"
						/>
					</div>

					<div className="mb-3">
						<div className="row-flex">
							<div className="col-four">
								<input
									type="text"
									className="form-control"
									name="googleBookSearch"
									value={googleBookSearch}
									onChange={e => setGoogleBookSearch(e.target.value)}
									placeholder="Search Google Books"
								/>
							</div>
						</div>
					</div>

					<div className="mb-3">
						<Button
							type="button"
							className="btn-success btn-md"
							onClick={() => getGoogleBooks()}
							//	onClick={() => getGoogleBooks({ variables: { searchString: googleBookSearch },})}
							buttonText="Get Google Books"
						/>
					</div>

					{googleBooksUseQueryDATA && (
						<div className="mb-3">
							<Button
								type="button"
								className="btn-primary btn-md"
								onClick={ async () => {
									await fetchMore({
										variables: {
											after: googleBooksUseQueryDATA.googleBooks.cursor,
										},
									});
								}}
								buttonText="fetchMore Google Books"
							/>
						</div>
					)}

				</div>
			</div>
		</>
	);
};

export default RESTfulExample;
