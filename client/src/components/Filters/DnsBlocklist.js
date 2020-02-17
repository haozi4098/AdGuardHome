import React, { Component, Fragment } from 'react';
import ReactTable from 'react-table';
import PropTypes from 'prop-types';
import { Trans, withNamespaces } from 'react-i18next';

import PageTitle from '../ui/PageTitle';
import Card from '../ui/Card';
import CellWrap from '../ui/CellWrap';
import Modal from './Modal';
import { formatDetailedDateTime } from '../../helpers/helpers';

import { MODAL_TYPE } from '../../helpers/constants';

class DnsBlocklist extends Component {
    componentDidMount() {
        this.props.getFilteringStatus();
    }

    handleRulesChange = (value) => {
        this.props.handleRulesChange({ userRules: value });
    };

    handleRulesSubmit = () => {
        this.props.setRules(this.props.filtering.userRules);
    };

    handleSubmit = (values) => {
        const { name, url } = values;
        const { filtering } = this.props;

        if (filtering.modalType === MODAL_TYPE.EDIT) {
            const data = { ...values };
            this.props.editFilter(filtering.modalFilterUrl, data);
        } else {
            this.props.addFilter(url, name);
        }
    };

    renderCheckbox = ({ original }) => {
        const { processingConfigFilter } = this.props.filtering;
        const { url, name, enabled } = original;
        const data = { name, url, enabled: !enabled };

        return (
            <label className="checkbox">
                <input
                    type="checkbox"
                    className="checkbox__input"
                    onChange={() => this.props.toggleFilterStatus(url, data)}
                    checked={enabled}
                    disabled={processingConfigFilter}
                />
                <span className="checkbox__label" />
            </label>
        );
    };

    handleDelete = (url) => {
        // eslint-disable-next-line no-alert
        if (window.confirm(this.props.t('filter_confirm_delete'))) {
            this.props.removeFilter({ url });
        }
    };

    getDateCell = row => CellWrap(row, formatDetailedDateTime);

    getFilter = (url, filters) => {
        const filter = filters.find(item => url === item.url);

        if (filter) {
            const { enabled, name, url } = filter;
            return { enabled, name, url };
        }

        return { name: '', url: '' };
    };

    columns = [
        {
            Header: <Trans>enabled_table_header</Trans>,
            accessor: 'enabled',
            Cell: this.renderCheckbox,
            width: 90,
            className: 'text-center',
        },
        {
            Header: <Trans>name_table_header</Trans>,
            accessor: 'name',
            minWidth: 200,
            Cell: CellWrap,
        },
        {
            Header: <Trans>filter_url_table_header</Trans>,
            accessor: 'url',
            minWidth: 200,
            Cell: ({ value }) => (
                <div className="logs__row logs__row--overflow">
                    <a
                        href={value}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link logs__text"
                    >
                        {value}
                    </a>
                </div>
            ),
        },
        {
            Header: <Trans>rules_count_table_header</Trans>,
            accessor: 'rulesCount',
            className: 'text-center',
            minWidth: 100,
            Cell: props => props.value.toLocaleString(),
        },
        {
            Header: <Trans>last_time_updated_table_header</Trans>,
            accessor: 'lastUpdated',
            className: 'text-center',
            minWidth: 150,
            Cell: this.getDateCell,
        },
        {
            Header: <Trans>actions_table_header</Trans>,
            accessor: 'url',
            className: 'text-center',
            width: 100,
            sortable: false,
            Cell: (row) => {
                const { value } = row;
                const { t, toggleFilteringModal } = this.props;

                return (
                    <div className="logs__row logs__row--center">
                        <button
                            type="button"
                            className="btn btn-icon btn-outline-primary btn-sm mr-2"
                            title={t('edit_table_action')}
                            onClick={() =>
                                toggleFilteringModal({
                                    type: MODAL_TYPE.EDIT,
                                    url: value,
                                })
                            }
                        >
                            <svg className="icons">
                                <use xlinkHref="#edit" />
                            </svg>
                        </button>
                        <button
                            type="button"
                            className="btn btn-icon btn-outline-secondary btn-sm"
                            onClick={() => this.handleDelete(value)}
                            title={this.props.t('delete_table_action')}
                        >
                            <svg className="icons">
                                <use xlinkHref="#delete" />
                            </svg>
                        </button>
                    </div>
                );
            },
        },
    ];

    render() {
        const {
            filtering, t, toggleFilteringModal, refreshFilters, addFilter,
        } = this.props;
        const {
            filters,
            isModalOpen,
            isFilterAdded,
            processingRefreshFilters,
            processingRemoveFilter,
            processingAddFilter,
            processingConfigFilter,
            processingFilters,
            modalType,
            modalFilterUrl,
        } = filtering;

        const currentFilterData = this.getFilter(modalFilterUrl, filters);

        return (
            <Fragment>
                {console.log(this.props)}
                <PageTitle title={t('dns_blocklist')} />
                <div className="content">
                    <div className="row">
                        <div className="col-md-12">
                            <Card
                                title={t('filters_and_hosts')}
                                subtitle={t('filters_and_hosts_hint')}
                            >
                                <ReactTable
                                    data={filters}
                                    columns={this.columns}
                                    showPagination={true}
                                    defaultPageSize={10}
                                    loading={
                                        processingFilters ||
                                        processingAddFilter ||
                                        processingRemoveFilter ||
                                        processingRefreshFilters
                                    }
                                    minRows={4}
                                    previousText={t('previous_btn')}
                                    nextText={t('next_btn')}
                                    loadingText={t('loading_table_status')}
                                    pageText={t('page_table_footer_text')}
                                    ofText="/"
                                    rowsText={t('rows_table_footer_text')}
                                    noDataText={t('no_filters_added')}
                                />
                                <div className="card-actions">
                                    <button
                                        className="btn btn-success btn-standard mr-2"
                                        type="submit"
                                        onClick={() =>
                                            toggleFilteringModal({ type: MODAL_TYPE.ADD })
                                        }
                                    >
                                        <Trans>add_filter_btn</Trans>
                                    </button>
                                    <button
                                        className="btn btn-primary btn-standard"
                                        type="submit"
                                        onClick={refreshFilters}
                                        disabled={processingRefreshFilters}
                                    >
                                        <Trans>check_updates_btn</Trans>
                                    </button>
                                </div>
                            </Card>
                        </div>
                        <div className="col-md-12">
                        </div>
                    </div>
                </div>
                <Modal
                    isOpen={isModalOpen}
                    toggleModal={toggleFilteringModal}
                    addFilter={addFilter}
                    isFilterAdded={isFilterAdded}
                    processingAddFilter={processingAddFilter}
                    processingConfigFilter={processingConfigFilter}
                    handleSubmit={this.handleSubmit}
                    modalType={modalType}
                    currentFilterData={currentFilterData}
                />
            </Fragment>
        );
    }
}

DnsBlocklist.propTypes = {
    setRules: PropTypes.func,
    getFilteringStatus: PropTypes.func.isRequired,
    filtering: PropTypes.shape({
        userRules: PropTypes.string.isRequired,
        filters: PropTypes.array.isRequired,
        isModalOpen: PropTypes.bool.isRequired,
        isFilterAdded: PropTypes.bool.isRequired,
        processingFilters: PropTypes.bool.isRequired,
        processingAddFilter: PropTypes.bool.isRequired,
        processingRefreshFilters: PropTypes.bool.isRequired,
        processingConfigFilter: PropTypes.bool.isRequired,
        processingRemoveFilter: PropTypes.bool.isRequired,
        modalType: PropTypes.string.isRequired,
    }),
    removeFilter: PropTypes.func.isRequired,
    toggleFilterStatus: PropTypes.func.isRequired,
    addFilter: PropTypes.func.isRequired,
    toggleFilteringModal: PropTypes.func.isRequired,
    handleRulesChange: PropTypes.func.isRequired,
    refreshFilters: PropTypes.func.isRequired,
    editFilter: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
};

export default withNamespaces()(DnsBlocklist);
