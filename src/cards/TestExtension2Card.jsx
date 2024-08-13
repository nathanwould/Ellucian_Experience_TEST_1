import { Typography } from '@ellucian/react-design-system/core';
import { withStyles } from '@ellucian/react-design-system/core/styles';
import { spacing10, spacing40 } from '@ellucian/react-design-system/core/styles/tokens';
import PropTypes from 'prop-types';
import React, { Fragment, useEffect, useState } from 'react';
import { withIntl } from '../utils/ReactIntlProviderWrapper';
import { useIntl } from 'react-intl';

const styles = () => ({
    card: {
        marginRight: spacing40,
        marginLeft: spacing40,
        paddingTop: spacing10
    },
    list: {
        paddingBottom: spacing40
    },
    formControl: {
        marginTop: spacing10,
        marginBottom: spacing40
    },
    text: {
        marginRight: spacing40,
        marginLeft: spacing40
    }
});

const cacheKey = 'graphql-card:sites';

/**
 * Demonstrates how to use a GraphQL query to make an Ethos request. Uses the SDK's
 * {code}getEthosQuery{code} function
 *
 * It uses the "list-buildings" query defined in this extension's `extension.js` file.
 *
 * @param {Object.<string, *>} props Component props
 * @returns {React.Component}        The Props card
 */
const TestExtensionCard = (props) => {
    const {
        // classes,
        cardControl: {
            setLoadingStatus,
            setErrorMessage
        },
        data: { getEthosQuery },
        cache: { getItem, storeItem }
    } = props;
    const intl = useIntl();
    const [ buildings, setBuildings ] = useState()

    useEffect(() => {
        (async () => {
            setLoadingStatus(true);

            const {data: cachedData, expired: cachedDataExpired=true} = await getItem({key: cacheKey});
            if (cachedData) {
                setLoadingStatus(false);
                setBuildings(() => cachedData);
            }
            if (cachedDataExpired || cachedData === undefined) {
                try {
                    const sectionData = await getEthosQuery({ queryId: 'buildings' });
                    console.log(sectionData)
                    const { data: { buildings: { edges: sectionEdges } = [] } = {} } = sectionData;
                    const buildings = sectionEdges.map( edge => edge.node );
                    setBuildings(() => buildings);
                    console.log(buildings)
                    storeItem({ key: cacheKey, data: buildings });
                    setLoadingStatus(false);
                } catch (error) {
                    console.error('ethosQuery failed', error);
                    setErrorMessage({
                        headerMessage: intl.formatMessage({ id: 'GraphQLQueryCard-fetchFailed' }),
                        textMessage: intl.formatMessage({ id: 'GraphQLQueryCard-fetchFailed' }),
                        iconName: 'error',
                        iconColor: '#D42828'
                    });
                }
            }
        })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    /**
     * Handle a dropdown site selection, by loading the associated buildings
     *
     * @param {Event} event The dropdown selection event.
     */

    return (
        <Fragment>
            {buildings &&
                <Typography as="h2">Data acquired</Typography>
            }
        </Fragment>
    );
};

TestExtensionCard.propTypes = {
    cardControl: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    cache: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired,
    mockSites: PropTypes.object,
    mockBuildings: PropTypes.object
};
export default withIntl(withStyles(styles)(TestExtensionCard));