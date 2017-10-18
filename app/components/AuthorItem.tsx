import * as React from 'react';
import styled, {keyframes} from 'styled-components';
import {Link} from "react-router-dom";


const StyledRouterLink = styled(Link)`
	text-decoration: none;
	width: 100%;
	color: ${(props: any) => props.theme.colors.accent};
	&:hover {
		color: ${(props: any) => props.theme.colors.hover};
	}
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
`;

const AuthorScoreContainer = styled.div`
	position: absolute;
	display: inline-block;
	right: ${(props: any) => props.theme.margins.small};
	font-size: 10px;
	color: ${(props: any) => props.theme.colors.subTitle};
`;

const AuthorItemContainer = styled.div`
    text-align: left;
    padding: ${(props: any) => props.theme.margins.medium};
		animation: ${fadeIn} ${(props: any) => { return props.animTime }}ms linear;
		
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		align-items: center;
`;

const SubTitleContainer = styled.div`
	color: ${(props: any) => props.theme.colors.subTitle};
	font-size: 12px;
`;

const DataContainer = styled.div`
  display: inline-block;
  width: calc(100% - 83px);
`;

const IconContainer = styled.div`
	display: inline-block;
	float: left;
	margin-right: ${(props: any) => props.theme.margins.small};
	background-color: ${(props: any) => props.theme.colors.divider};
	color:  ${(props: any) => props.theme.colors.white};
	
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	justify-content: center;
	align-items: center;
	
	padding: ${(props: any) => props.theme.margins.tiny};
	border-radius: 25px;
	width: 28px;
	height: 28px;
`;

const AuthorItem = (props: AuthorType) => {
	let coAuthors;
	if (props.coAuthors && props.coAuthors.length > 0) {
		let authorArrayString = props.coAuthors.map((coauthor, index: number) => {
			if (index === 5) {
				return 'and ' + (props.coAuthors.length - 5) + ' more.';
			} else if (index < 5) {
				return coauthor.name;
			}
		});
		const coAuthorString = authorArrayString.filter((item) => typeof item !== 'undefined').join(', ');
		coAuthors = <SubTitleContainer>Worked with: {coAuthorString}</SubTitleContainer>;
	}
	let authorScore = props.score ? props.score.toFixed(2) : '';

	return (
		<AuthorItemContainer animTime={props.animTime}>
			<AuthorScoreContainer>{authorScore}</AuthorScoreContainer>
			<IconContainer>
				<i className="material-icons">person</i>
			</IconContainer>
			<DataContainer>
				<StyledRouterLink to={'/author/' + props.id}>{props.name}</StyledRouterLink>
				{coAuthors}
			</DataContainer>
		</AuthorItemContainer>
	);
};

export { AuthorItem };