'use strict';

// Libraries
import * as React from 'react';
import style from 'styled-components';
import * as $ from 'jquery';
import {PaperList} from "app/components/PaperList";
import {InputField} from "app/components/InputField";
import {TopicList} from 'app/components/TopicList';
import {TabSelector} from "../components/TabSelector";
import {withRouter} from "react-router";

const CenterContainer = style.div`
	position: relative;
	top: 50%;
	transform: translateY(-50%);
	text-align: center;
	padding-bottom: 80px;
`;

const InputContainer = style.div`
	width: 600px;
	margin: 0 auto;
`;

const SearchContainer = style.div`
	height: 100%;
	width: calc(100% - ${(props: any) => props.theme.margins.smallx2});
`;

const HeaderContainer = style.div`
	width: 100%;
	padding: ${(props: any) => props.theme.margins.small};
	padding-bottom: 0px;
	background-color: ${(props: any) => props.theme.colors.header};
`;

const ResultContainer = style.div`
	width: 100%
`;


interface SearchProps {
	history: any,
	match: any
}

interface SearchState {
	papers: Array<PaperType>
}

class SearchWithoutRouter extends React.Component<SearchProps, SearchState> {
	constructor(props: SearchProps) {
		super();
		this.state = {
			papers: []
		};
		this.onInputEnter = this.onInputEnter.bind(this);
	}

	componentWillMount() {
		let initialUrl = this.props.match.params;
		this.queryForUrl(initialUrl);
	}

	componentWillReceiveProps(nextProps: SearchProps) {
		let oldUrl = this.props.match.params;
		let newUrl = nextProps.match.params;
		if (oldUrl.domain !== newUrl.domain || oldUrl.query !== newUrl.query) {
			this.queryForUrl(newUrl);
		}
	}

	queryForUrl(url: {query: string, domain: string}) {
		this.queryData( {
			query: url.query,
			domain: url.domain
		})
	}

	handleQueryReply(data: any) {
		let urlParams = this.props.match.params;
		if (data.query !== urlParams.query || data.domain !== urlParams.domain) {
			const domain = urlParams.domain || 'papers';
			this.props.history.push('/search/' + domain + '/' + data.query);
		}
		this.setState({
			...this.state,
			papers: data.papers
		});
	}

	queryData(postData: { query: string, domain: string }) {
		$.ajax({
			url: "/query",
			type: "POST",
			data: JSON.stringify(postData),
			contentType: "application/json",
			success: (data) => {
				// Handle the change
				this.handleQueryReply({
					papers: data,
					query: postData.query,
					domain: postData.domain,
				});
			}
		});
	}

	onInputEnter(value: string) {
		// Reset state
		this.setState({
			...this.state,
			papers: []
		});
		this.queryData({
			query: value,
			domain: this.props.match.params.domain || 'papers'
		});
	}

	render() {
		let params = this.props.match.params;
		let inputField = <InputField
			placeholder="Search..."
			value={params.query}
			onEnter={this.onInputEnter}
		/>;
		if (params.domain === undefined || params.query === undefined)
			return (
				<SearchContainer>
					<CenterContainer>
						<InputContainer>
							<h1>NIPS explorer</h1>
							{inputField}
						</InputContainer>
					</CenterContainer>
				</SearchContainer>
			);
		else {
			return (
				<SearchContainer>
					<HeaderContainer>
						<InputContainer>
							{inputField}
						</InputContainer>
						<TabSelector tabs={[
							{label: 'Papers', route: '/search/papers/'   + params.query || '', selected: params.domain === 'papers'},
							{label: 'Authors', route: '/search/authors/' + params.query || '', selected: params.domain === 'authors'}
						]}/>
					</HeaderContainer>
					<ResultContainer>
						<PaperList papers={this.state.papers}/>
						<TopicList topics={[{name: 'clustering'}]}/>
					</ResultContainer>
				</SearchContainer>
			);
		}
	}
}

let Search = withRouter(SearchWithoutRouter);

export {Search};
