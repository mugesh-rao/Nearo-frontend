import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import { formatDateTime } from "../utils/dateTime";
import PropTypes from "prop-types";
import { money_format } from "../utils/money_format";

// import signature from "../imgs/signature.png"
const styles = StyleSheet.create({
  page: {
    // backgroundColor: "#E4E4E4",
    // // display:"flex",
    flexDirection: "row",
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  pageNumber: {
    position: "absolute",
    bottom: 30,
    right: 0,
    left: 0,
    fontSize: 14,
    color: "red",
    textAlign: "center",
  },
  heading: {
    fontSize: 20,
    textAlign: "center",
    fontWeight: 900,
    textDecoration: "underline",
  },
  paraGraphs: {
    fontSize: 10,
    fontWeight: "light",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    margin: "20 0",
  },
  details: {
    width: "auto",
    marginBottom: 10,
    lineHeight: "1.5",
  },
  table: {
    display: "table",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  tableCell: {
    // margin: "auto",
    fontSize: 10,
    marginVertical: 0,
    borderStyle: "solid",
    padding: 2,
    width: "10%",
    alignItems: "center",
  },
  total: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: 11,
    fontWeight: "bold",
    padding: 4,
    paddingTop: 6,
    marginVertical: 5,
    marginTop: 10,
    borderTop: 1,
    borderStyle: "solid",
  },
  last: {
    margin: "80 0",
    width: 180,
  },
  x: {
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  image: {
    width: 200, // Set the width of the image
    height: 100, // Set the height of the image
  },
  hsn: {
    fontSize: 7,
    marginTop: 1,
    marginBottom: 1,
    marginLeft: 5,
    fontWeight:"thin"
  },
});
const Bill = ({ bill_datas }) => {
  if (!bill_datas) {
    return null; // or handle the case when bill_datas is not available
  }

  const {
    customer_data,
    order_data,
    products_data,
    qr_code_url,
    seller_data,
    shipment_details,
    shop_data,
  } = bill_datas;

  const calculateTotalAmount = () => {
    let totalAmount = 0;
    for (let i = 0; i < products_data?.length; i++) {
      totalAmount += +products_data[i].total_price_with_tax;
    }
    return totalAmount;
  };

  const totalAmount = calculateTotalAmount();

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.heading}>Tax Invoice</Text>
          <View style={styles.paraGraphs}>
            <View style={styles.details}>
              <Text
                style={{ fontSize: 12, fontWeight: "heavy", margin: "3 0" }}
              >
                Sold By
              </Text>
              <Text>{shop_data?.shop_name} </Text>
              <Text style={{ textTransform: "capitalize" }}>
                {shop_data?.shop_address}
              </Text>
              <Text>
                GSTIN:
                {seller_data?.gst_number ? seller_data?.gst_number : "empty"}
              </Text>
              <Text>
                Order Date:{" "}
                {formatDateTime(order_data?.order_time).toLocaleString()}
              </Text>
              <Text>Contact:{shop_data?.shop_contact}</Text>
            </View>

            <View style={styles.details}>
              <Text
                style={{ fontSize: 12, fontWeight: "extrabold", margin: "3 0" }}
              >
                Orderd By
              </Text>
              <Text>{customer_data.name}</Text>
              <Text>Contact:{customer_data.phone_no}</Text>
            </View>
            <View>
              <Image
                src={qr_code_url}
                alt="product"
                style={{ height: "84px", width: "80px" }}
              />
              <Text style={{ textAlign: "center", width: "80px" }}>
                Invoice:
                {shipment_details.order_shipment_slip_id}
              </Text>
              <Text style={{ textAlign: "center", width: "80px" }}>
                Order Id: {shipment_details?.order_id}
              </Text>
            </View>
          </View>

          {/* table============= */}

          <View style={styles.table}>
            <View
              style={[styles.tableRow, { borderBottom: "1px solid black" }]}
            >
              <View
                style={[
                  styles.tableCell,
                  { width: "30%", fontSize: 12, fontWeight: "semibold" },
                ]}
              >
                <Text>Product</Text>
              </View>
              <View
                style={[
                  styles.tableCell,
                  { fontSize: 10, fontWeight: "semibold" },
                ]}
              >
                <Text>Qty</Text>
              </View>
              <View
                style={[styles.tableCell, { fontSize: 10, fontWeight: "bold" }]}
              >
                <Text>Gross Amount</Text>
              </View>
              <View
                style={[styles.tableCell, { fontSize: 10, fontWeight: "bold" }]}
              >
                <Text>Discount</Text>
              </View>
              <View
                style={[styles.tableCell, { fontSize: 10, fontWeight: "bold" }]}
              >
                <Text>Taxble Price</Text>
              </View>
              <View
                style={[styles.tableCell, { fontSize: 10, fontWeight: "bold" }]}
              >
                <Text>IGST</Text>
              </View>
              <View
                style={[
                  styles.tableCell,
                  { fontSize: 12, fontWeight: "semibold" },
                ]}
              >
                <Text>Total</Text>
              </View>
            </View>
            {products_data?.map((item, index) => (
              <View key={index} style={styles.tableRow}>
                <View style={[styles.tableCell, { width: "30%" }]}>
                  <Text
                    style={[
                      styles.tableCell,
                      { width: "100%"},
                    ]}
                  >
                    {item.product_title}
                  </Text>
                  <Text style={[styles.hsn, { width: "100%" }]}>
                    HSN:{item.hsn_code}{" "}
                  </Text>
                </View>
                <View style={styles.tableCell}>
                  <Text>1</Text>
                </View>
                <View style={styles.tableCell}>
                  <Text>{item.total_price_with_tax} </Text>
                </View>
                <View style={styles.tableCell}>
                  <Text>-{+item.total_mrp - +item.total_price_with_tax}</Text>
                </View>
                <View style={styles.tableCell}>
                  <Text>{item.single_pc_price_without_tax}</Text>
                </View>
                <View style={styles.tableCell}>
                  <Text>{item.single_pc_tax_amount}</Text>
                </View>
                <View style={styles.tableCell}>
                  <Text>{item.total_price_with_tax}</Text>
                </View>
              </View>
            ))}
            <View style={[styles.total]}>
              <Text>Total Quantity:{products_data?.length} </Text>
              <Text>Total Price: {totalAmount} </Text>
            </View>
          </View>

          {/* table finish=============== */}

          <View style={styles.x}>
            <View style={[styles.last, { textAlign:"center" }]}>
              <Text>Thank You!</Text>
              <Text style={{ fontSize: 14 }}>For Shopping On Nearo</Text>
            </View>
          </View>
        </View>

        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) => `${pageNumber}/${totalPages}`}
          fixed
        />
      </Page>
    </Document>
  );
};
Bill.propTypes = {
  bill_datas: PropTypes.shape({
    customer_data: PropTypes.shape({
      name: PropTypes.string.isRequired,
      phone_no: PropTypes.string.isRequired,
    }).isRequired,
    order_data: PropTypes.shape({
      order_time: PropTypes.string.isRequired,
      // Add more properties as needed
    }).isRequired,
    products_data: PropTypes.arrayOf(
      PropTypes.shape({
        item: PropTypes.string.isRequired,
        quantity: PropTypes.number.isRequired,
        discount: PropTypes.number.isRequired,
        total: PropTypes.number.isRequired,
        gross_amount: PropTypes.number.isRequired,
        taxble_price: PropTypes.number.isRequired,
        gst: PropTypes.number.isRequired,
      })
    ).isRequired,
    qr_code_url: PropTypes.string.isRequired,
    seller_data: PropTypes.shape({
      gst_number: PropTypes.string.isRequired,
      // Add more properties as needed
    }).isRequired,
    shipment_details: PropTypes.shape({
      order_id: PropTypes.string.isRequired,
      order_shipment_slip_id: PropTypes.string.isRequired,
      // Add more properties as needed
    }).isRequired,
    shop_data: PropTypes.shape({
      shop_address: PropTypes.string.isRequired,
      shop_city: PropTypes.string.isRequired,
      shop_name: PropTypes.string.isRequired,
      shop_pincode: PropTypes.string.isRequired,
      shop_state: PropTypes.string.isRequired,
      shop_contact: PropTypes.string.isRequired,
      // Add more properties as needed
    }).isRequired,
  }).isRequired,
};
export default Bill;
