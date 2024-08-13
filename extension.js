const { default: gql } = require("graphql-tag");

module.exports = {
    name: 'TestExtension2',
    publisher: 'Bard College',
    cards: [{
        type: 'TestExtension2Card',
        source: './src/cards/TestExtension2Card',
        title: 'TestExtension2 Card',
        displayCardType: 'TestExtension2 Card',
        description: 'This is an introductory card to the Ellucian Experience SDK',
        pageRoute: {
            route: '/',
            excludeClickSelectors: ['a']
        }
    }],
    queries: {
        'buildings': [
            {
                resourceVersions: {
                    sections: { min: 16 },
                },
                query: gql`{
                    buildings6 (limit: 10, sort: { title: ASC } ) {
                        edges {
                        node {
                            id
                            title
                            description
                        }
                        }
                    }
                }`
            }
        ],
    },
    page: {
        source: './src/page/router.jsx'
    }
};