// Libraries
import * as React from 'react';
import style from 'styled-components';
import {withRouter} from "react-router";
import * as $ from 'jquery';
import {LoadingIndicator} from "../components/LoadingIndicator";
import {PaperList} from "../components/PaperList";

const HeaderContainer = style.div`
	width: calc(100% - ${(props: any) => props.theme.margins.smallx2});
	padding: ${(props: any) => props.theme.margins.small};
	padding-bottom: 0px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
	background-color: ${(props: any) => props.theme.colors.header};
`;

interface AuthorProps {
	history: any,
	match: any
}

interface AuthorState {
	loading: boolean,
	author: AuthorType
}

class AuthorWithoutRouter extends React.Component<AuthorProps, AuthorState> {
	constructor() {
		super();
		this.state = {
			loading: false,
			author: undefined
		};
	}

	queryForUrl(id: string) {
		this.setState({
			... this.state,
			loading: true
		});
		let postData = {'domain': 'author', 'query': parseInt(id, 10)};
		$.ajax({
			url: "/query",
			type: "POST",
			data: JSON.stringify(postData),
			contentType: "application/json",
			success: (data) => {
				// Handle the change
				this.setState({
					... this.state,
					loading: false,
					author: data.author
				})
			}
		});
	}

	componentWillMount() {
		this.queryForUrl(this.props.match.params.id);
	}

	render() {
		let searchResult;
		if (this.state.loading) {
			searchResult = <LoadingIndicator />
		} else {
			searchResult = (
				<div>
					<HeaderContainer>
						<h2>{this.state.author.name}</h2>
					</HeaderContainer>
					<PaperList papers={this.state.author.papers} />
				</div>
			);

		}


		return searchResult;
	}
}

let Author = withRouter(AuthorWithoutRouter);

export {Author};