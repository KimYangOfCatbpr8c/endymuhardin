declare var React: any;

var BulletGraph = React.createClass({
    render: function () {
        return <div>
            <h3>
                Profits</h3>
            <table className="table condensed">
                <tbody>
                    {
                        this.props.data.items.map((item, index) =>
                            <tr key={index}>
                                <td>
                                    {wijmo.Globalize.format(item.date, 'MMM yyyy')}
                                </td>
                                <td>
                                    <span
                                        className="label label-danger"
                                        style={{ borderRadius: '1em', display: item.profit <= 400 ? '' : 'none' }}>!</span>
                                </td>
                                <td>
                                    <Wj.BulletGraph
                                        value={item.profit}
                                        min={0}
                                        bad={400}
                                        target={600}
                                        good={600}
                                        max={1000} />
                                </td>
                            </tr>
                        )
                    }
                </tbody>
            </table>
        </div>
    }
});